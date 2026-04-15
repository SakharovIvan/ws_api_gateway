import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WsCoreService } from './ws_core.service';
import { REPAIR_ROUTES } from 'lib/WS_types/ws_core/routes';
import { WS_CMD, WS_CORE_FUNCs } from 'lib/WS_types/ws_core/repair.cmd';
import {
  Repair_Main_type,
  Repair_Main_type_filter,
  Repair_types,
} from 'lib/WS_types/ws_core/repair.types';
import {
  type Purchaser,
  type Seller,
  type Tool,
} from 'lib/WS_types/ws_core/product_repair.types';
import { AuthService } from 'src/auth/auth.service';
import { UserId } from 'src/decoartors/userId';
import { JwtValidationGuard } from 'src/guards/auth.guards';
import { ChatService } from 'src/chat/chat.service';
import { FileStorageService } from 'src/file_storage/file_storage.service';

@Controller(REPAIR_ROUTES.MAIN)
export class WsCoreController implements Partial<WS_CORE_FUNCs> {
  constructor(
    private readonly authService: AuthService,
    private readonly fileStorageService: FileStorageService,

    private readonly chatService: ChatService,
    private readonly wsCoreService: WsCoreService,
  ) {}

  @UseGuards(JwtValidationGuard)
  @Post('')
  async create_new_repa(
    @UserId() user_id: string,
    @Body() data: { repair: Repair_Main_type },
  ): Promise<Repair_Main_type> {
    const res = await this.wsCoreService.create_new_repair({
      user_id,
      ...data,
    });
    if (res) {
      try {
        await this.chatService.createChat({ path: res.id });
        await this.fileStorageService.create_bucket({
          name: res.id,
          description: 'repair',
        });
      } catch (error) {}
    }
    return res;
  }
  @Get('')
  async get_repair(@Query() query: Partial<Repair_Main_type>) {
    return this.wsCoreService.get_repair(query);
  }
  @Get(REPAIR_ROUTES.TYPE + REPAIR_ROUTES.list)
  getTypes(): Promise<Repair_types[]> {
    return this.wsCoreService.getTypes();
  }

  @Post(REPAIR_ROUTES.TYPE + '/find')
  findType(@Body() data: Partial<Repair_types>): Promise<Repair_types> {
    return this.wsCoreService.findType(data);
  }

  @Post(REPAIR_ROUTES.TYPE)
  createType(@Body() data: Omit<Repair_types, 'id'>): Promise<void> {
    return this.wsCoreService.createType(data);
  }

  @Post(REPAIR_ROUTES.TOOL)
  createTool(@Body() data: Partial<Tool>): Promise<Tool> {
    return this.wsCoreService.create(data);
  }

  @Post(REPAIR_ROUTES.TOOL + '/search')
  searchTool(
    @Body() body: { data: Partial<Tool>; create?: boolean },
  ): Promise<Tool[] | null> {
    return this.wsCoreService.search(body.data, body.create);
  }

  @Put(REPAIR_ROUTES.TOOL)
  updateTool(
    @Body() data: { current_tool_id: string; data: Partial<Tool> },
  ): Promise<Tool> {
    return this.wsCoreService.update(data);
  }

  @Post(REPAIR_ROUTES.SELLER)
  get_sellers(@Body() data: Partial<Seller>): Promise<Seller[] | null> {
    return this.wsCoreService.get_sellers(data);
  }

  @Post(REPAIR_ROUTES.SELLER + '/upsert')
  upsert_seller(@Body() data: Seller): Promise<Seller> {
    return this.wsCoreService.upsert_seller(data);
  }

  @Post(REPAIR_ROUTES.PURCHASER)
  get_purchasers(
    @Body() data: Partial<Purchaser>,
  ): Promise<Purchaser[] | null> {
    return this.wsCoreService.get_purchasers(data);
  }

  @Post(REPAIR_ROUTES.PURCHASER + '/upsert')
  upsert_purchaser(@Body() data: Purchaser): Promise<Purchaser> {
    return this.wsCoreService.upsert_purchaser(data);
  }

  @UseGuards(JwtValidationGuard)
  @Post(REPAIR_ROUTES.list)
  getRepairList(
    @UserId() user_id: string,
    @Body() data: { repair: Repair_Main_type },
  ): Promise<any> {
    return this.wsCoreService.get_repair_list({ user_id, ...data });
  }

  @UseGuards(JwtValidationGuard)
  @Put()
  update_repa(
    @UserId() user_id: string,
    @Body() data: { repair: Repair_Main_type },
  ): Promise<any> {
    return this.wsCoreService.update_repair({ user_id, ...data });
  }

  @Delete()
  delete_repair(@Query('id') id: string, @Query('user_id') user_id: string) {
    return this.wsCoreService['command'](WS_CMD.delete_repair, { id, user_id });
  }

  // =============================================================================
  // 🧪 Дополнительно: Пример данных (если нужен)
  // =============================================================================

  @Get('/sample')
  getSample() {
    return this.wsCoreService['command'](WS_CMD.repair_sample, {});
  }
}
