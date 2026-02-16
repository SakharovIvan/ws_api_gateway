import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { WsCoreModule } from './ws_core/ws_core.module';
import { CatalogueModule } from './catalogue/catalogue.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, WsCoreModule, CatalogueModule],
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
    AppService,
  ],
})
export class AppModule {}
