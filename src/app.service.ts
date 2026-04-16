import { Injectable } from '@nestjs/common';
import { SeedsService } from './seeds/seeds.service';

@Injectable()
export class AppService {
   constructor(private readonly seedService: SeedsService) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.seedService.sync_services()
  }

}
