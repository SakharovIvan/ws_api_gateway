import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthService } from 'src/auth/auth.service';
import { CUSOMER_ROUTES } from 'lib/WS_types/customer/routes';
import { UserId } from 'src/decoartors/userId';
import { Customer } from 'lib/WS_types/customer/customer.types';

@Controller(CUSOMER_ROUTES.MAIN)
export class CustomerController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
  ) {}

  @Get()
  async getCustomer(@UserId() user_id: string) {
    return this.customerService.get({ user_id });
  }

  @Get(CUSOMER_ROUTES.LIST)
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
