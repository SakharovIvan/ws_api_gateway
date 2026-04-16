import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { FileStorageModule } from 'src/file_storage/file_storage.module';

@Module({
  imports: [ConfigModule.forRoot(),FileStorageModule],
  controllers: [CatalogueController],
  providers: [
    CatalogueService,
    {
      provide: 'CATALOGUE_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: configService.get('CATALOGUE_SERVICE_PORT'),
            host: configService.get('CATALOGUE_SERVICE_HOST'),
          },
        }),
    },
  ],
  exports: [CatalogueService],
})
export class CatalogueModule {}
