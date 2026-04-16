import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { WsCoreModule } from './ws_core/ws_core.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { ChatModule } from './chat/chat.module';
import { FileStorageModule } from './file_storage/file_storage.module';
import { CustomerModule } from './customer/customer.module';
import { SeedsModule } from './seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    WsCoreModule,
    CatalogueModule,
    ChatModule,
    FileStorageModule,
    CustomerModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
    },
    {
      provide: 'WS_CORE_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('WS_CORE_SERVICE_HOST'),
            port: configService.get('WS_CORE_SERVICE_PORT'),
          },
        }),
    },
    {
      provide: 'CUSTOMER_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('CUSTOMER_SERVICE_HOST'),
            port: configService.get('CUSTOMER_SERVICE_PORT'),
          },
        }),
    },
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
    {
      provide: 'CHAT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('CHAT_SERVICE_HOST'),
            port: configService.get('CHAT_SERVICE_TCP_PORT'),
          },
        }),
    },
    {
      provide: 'FILE_STORAGE_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('FILE_STORAGE_SERVICE_HOST'),
            port: configService.get('FILE_STORAGE_SERVICE_PORT'),
          },
        }),
    },
    AppService,
  ],
})
export class AppModule {}
