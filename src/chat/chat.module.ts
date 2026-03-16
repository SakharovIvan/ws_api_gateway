import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],

  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: 'CHAT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('CHAT_SERVICE_HOST'),
            port: configService.get('CHAT_SERVICE_PORT'),
          },
        }),
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
