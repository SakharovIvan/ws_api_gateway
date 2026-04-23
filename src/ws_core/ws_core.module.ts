import { Module } from '@nestjs/common';
import { WsCoreController } from './ws_core.controller';
import { WsCoreService } from './ws_core.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { FileStorageModule } from 'src/file_storage/file_storage.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ChatModule, FileStorageModule,CustomerModule],
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
  exports: [WsCoreService],
})
export class WsCoreModule {}
