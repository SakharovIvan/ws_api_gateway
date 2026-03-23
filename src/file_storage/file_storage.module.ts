import { Module } from '@nestjs/common';
import { FileStorageService } from './file_storage.service';
import { FileStorageController } from './file_storage.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],

  providers: [
    FileStorageService,
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
  ],
  controllers: [FileStorageController],
  exports: [FileStorageService],
})
export class FileStorageModule {}
