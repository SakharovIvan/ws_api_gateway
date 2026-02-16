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
import { WS_CMD } from 'lib/WS_types/ws_core/repiar.cmd';

@Injectable()
export class WsCoreService {
  constructor(
    @Inject('WS_CORE_SERVICE')
    private readonly coreService: ClientProxy,
  ) {}
  private async command(cmd: WS_CMD | string, data: any) {
    return lastValueFrom(this.coreService.send({ cmd }, data)).catch((err) => {
      throw new HttpException(err.message, err.status | 400);
    });
  }
  async repair_Sample() {
    return this.command(WS_CMD.repair_sample, '');
  }
  async createRepair(data: Partial<Repair_Main_type>) {
    return this.command(WS_CMD.create_new, data);
  }
  async get_Repair_list(data: Partial<Repair_Main_type>) {
    return this.command(WS_CMD.get_repair_list, data);
  }
  async updateRepair(data: Partial<Repair_Main_type>) {
    return this.command(WS_CMD.update_repair, data);
  }
  async createNewType(data: Repair_types) {}
  async workUpdate(data: Repair_Work) {}
  async toolUpdate(data: Tool) {}
  async sellerUpdate(data: Seller) {}
  async purchaserUpdate(data: Purchaser) {}
}
