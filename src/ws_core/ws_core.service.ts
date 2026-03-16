import { lastValueFrom } from 'rxjs';
import { Injectable, Inject, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Repair_Main_type,
  Repair_types,
  Repair_Work,
} from 'lib/WS_types/ws_core/repair.types';
import {
  Purchaser,
  Seller,
  Tool,
} from 'lib/WS_types/ws_core/product_repair.types';
import {
  WS_CMD,
  WS_CORE_FUNCs,
  type WS_CORE_ClientProxy,
} from 'lib/WS_types/ws_core/repair.cmd';

@Injectable()
export class WsCoreService implements WS_CORE_FUNCs {
  constructor(
    @Inject('WS_CORE_SERVICE')
    private readonly coreService: WS_CORE_ClientProxy,
  ) {}
  private async command(cmd: WS_CMD, data: any): Promise<any> {
    const res = await lastValueFrom(this.coreService.send(cmd, data)).catch(
      (err) => {
        console.log(err);
        throw new HttpException(err.message, err.status | 400);
      },
    );
    console.log(res);
    return res;
  }
  getTypes(): Promise<Repair_types[]> {
    return this.command(WS_CMD.get_types, {});
  }
  findType(data: Partial<Repair_types>): Promise<Repair_types> {
    return this.command(WS_CMD.find_type, data);
  }
  createType(data: Omit<Repair_types, 'id'>): Promise<void> {
    return this.command(WS_CMD.create_type, data);
  }
  create(data: Partial<Tool>): Promise<Tool> {
    return this.command(WS_CMD.tool_create, data);
  }
  search(data: Partial<Tool>, create?: boolean): Promise<Tool[] | null> {
    return this.command(WS_CMD.tool_search_upsert, { data, create });
  }

  update(data: { current_tool_id: string; data: Partial<Tool> }) {
    return this.command(WS_CMD.tool_update, data);
  }
  get_sellers(data: Partial<Seller>): Promise<Seller[] | null> {
    return this.command(WS_CMD.nomenclature_get_sellers, data);
  }
  get_purchasers(data: Partial<Purchaser>): Promise<Purchaser[] | null> {
    return this.command(WS_CMD.nomenclature_get_purchasers, data);
  }

  upsert_seller(data: Seller): Promise<Seller> {
    return this.command(WS_CMD.nomenclature_upsert_seller, data);
  }

  upsert_purchaser(data: Purchaser): Promise<Purchaser> {
    return this.command(WS_CMD.nomenclature_upsert_purchaser, data);
  }

  create_new_repair(data: {
    user_id: string;
    repair: Repair_Main_type;
  }): Promise<Repair_Main_type> {
    return this.command(WS_CMD.create_new, data);
  }

  update_repair(data: { user_id: string; repair: Repair_Main_type }) {
    return this.command(WS_CMD.update_repair, data);
  }
  get_repair_list(data: { user_id: string; repair: Repair_Main_type }) {
    return this.command(WS_CMD.get_repair_list, {
      ...data.repair,
      user_id: data.user_id,
    });
  }
}
