import { Module } from '@nestjs/common';
import { WsCoreController } from './ws_core.controller';
import { WsCoreService } from './ws_core.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WsCoreController],
  providers: [
    WsCoreService,
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
  ],
})
export class WsCoreModule {}
