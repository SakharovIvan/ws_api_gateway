import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { FileStorageModule } from 'src/file_storage/file_storage.module';
import { ChatModule } from 'src/chat/chat.module';
import { CatalogueModule } from 'src/catalogue/catalogue.module';
import { WsCoreModule } from 'src/ws_core/ws_core.module';

@Module({
  imports:[FileStorageModule,CatalogueModule,ChatModule,WsCoreModule],
  providers: [SeedsService],
  exports:[SeedsService]
})
export class SeedsModule {}
