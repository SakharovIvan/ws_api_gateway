import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
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
  ],
})
export class CustomerModule {}
