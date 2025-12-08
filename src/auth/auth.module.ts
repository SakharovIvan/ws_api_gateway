import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
        ConfigModule.forRoot(),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          url: process.env.AUTH_SERVICE_SLAVE_HOST + ':' + process.env.AUTH_SERVICE_SLAVE_PORT,
          loader: { keepCase: true },
          protoPath: join(__dirname, '../../../lib/B2B_types/proto/user.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
