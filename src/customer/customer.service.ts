import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Valid_User } from 'lib/WS_types/auth_service/main';
import { Customer } from 'lib/WS_types/customer/customer.types';
import { Customer_CMDs, Customer_funcs } from 'lib/WS_types/customer/routes';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CustomerService implements Customer_funcs {
  constructor(
    @Inject('CUSTOMER_SERVICE')
    private readonly coreService: ClientProxy,
  ) {}
  private async command(cmd: Customer_CMDs, data: any): Promise<any> {
    const res = await lastValueFrom(this.coreService.send(cmd, data)).catch(
      (err) => {
        console.log(err);
        throw new HttpException(err.message, err.status | 400);
      },
    );
    return res;
  }

  async create(Customer: Customer[]): Promise<Customer[]> {
    return this.command(Customer_CMDs.Create, Customer);
  }
  async patch(Customer: Customer[]): Promise<Customer[]> {
    return this.command(Customer_CMDs.Patch, Customer);
  }
  async get(data: { user?: Valid_User; user_id?: string }): Promise<Customer> {
    return this.command(Customer_CMDs.Get, data);
  }

  async get_List(Customer: Partial<Customer>): Promise<Customer[]> {
    return this.command(Customer_CMDs.Get_List, Customer);
  }
  async set_user(data: {
    user_id: string;
    Customer_id: string;
  }): Promise<void> {
    return this.command(Customer_CMDs.Set_user, data);
  }
}
