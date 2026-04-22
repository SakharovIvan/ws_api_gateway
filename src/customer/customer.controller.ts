import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthService } from 'src/auth/auth.service';
import { CUSTOMER_ROUTES } from 'lib/WS_types/customer/routes';
import { Customer_Decorator, User_Role, UserId } from 'src/decoartors/userId';
import { type Customer } from 'lib/WS_types/customer/customer.types';
import { CustomerValidationGuard } from 'src/guards/auth.guards';

@Controller(CUSTOMER_ROUTES.MAIN)
export class CustomerController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
  ) {}
  @UseGuards(CustomerValidationGuard)
  @Get('/my')
  async getMyCustomer(@Customer_Decorator() customer: Customer) {
    return customer;
  }
  @Get()
  async getCustomer(@Query() data: { user_id: string }) {
    this.authService.validate;
    return this.customerService.get({ user_id: data.user_id });
  }

  @Get(CUSTOMER_ROUTES.LIST)
  async getCustomerList(@Query() query: Partial<Customer>) {
    return this.customerService.get_List(query);
  }

  @Patch()
  async updateCustomer(@Body() customer: Customer[]) {
    return this.customerService.patch(customer);
  }

  @Patch('auth')
  async updateCustomerInfo(
    @Body() data: { user_id: string; Customer_id: string },
  ) {
    return this.customerService.set_user(data);
  }

  @Post()
  async partlyUpdateCustomer(@Body() body: Customer[]) {
    return this.customerService.create(body);
  }
}
