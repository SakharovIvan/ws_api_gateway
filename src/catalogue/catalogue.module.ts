import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule.forRoot()],
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
            host: configService.get('CATALOGUE_SERVICE_HOST'),
            port: configService.get('CATALOGUE_SERVICE_PORT'),
          },
        }),
    },
  ],
})
export class CatalogueModule {}
