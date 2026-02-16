import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { WsCoreService } from './ws_core.service';
import type { Repair_Main_type } from 'lib/WS_types/ws_core/repair.types';
import { REPAIR_ROUTES } from 'lib/WS_types/ws_core/routes';

@Controller(REPAIR_ROUTES.MAIN)
export class WsCoreController {
  constructor(private readonly ws_coreService: WsCoreService) {}
  @Get()
  async repairSample() {
    return this.ws_coreService.repair_Sample();
  }
  @Post()
  async repair(@Body() data: Partial<Repair_Main_type>) {
    return this.ws_coreService.createRepair(data);
  }

  @Post()
  async update() {}

  @Post()
  async sentFileAttachment() {}

  @Get(REPAIR_ROUTES.lsit)
  async repair_list() {}
}
