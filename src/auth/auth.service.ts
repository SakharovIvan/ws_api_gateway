import { Injectable, Inject, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthDto,
  CreateUserDto,
  MainRegistrationUserDto,
} from 'lib/WS_types/auth_service/auth.dto';
import {
  AUTH_CMD,
  AuthTokens,
  Role,
  Token_Schema,
  UserModel,
  Valid_User,
} from 'lib/WS_types/auth_service/main';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
  ) {}

  private async commands(cmd: AUTH_CMD, data) {
    return lastValueFrom(this.authService.send({ cmd }, data)).catch((err) => {
      throw new HttpException(err.message, err.status | 400);
    });
  }

  async validate(token: string): Promise<Token_Schema> {
    return this.commands(AUTH_CMD.validate, token);
  }
  async validate_user_model_by_email(email: string): Promise<UserModel> {
    return this.commands(AUTH_CMD.validate_user_model, { email });
  }
  async registration(data: MainRegistrationUserDto) {
    return this.commands(AUTH_CMD.registration, data);
  }
  async login(data: AuthDto) {
    return this.commands(AUTH_CMD.login, data);
  }
  async logout(token) {
    return this.commands(AUTH_CMD.logout, token);
  }
  async refresh(token): Promise<AuthTokens> {
    return this.commands(AUTH_CMD.refresh, token);
  }
  async activate(token) {
    return this.commands(AUTH_CMD.activate, token);
  }
  async resetpassword() {}
  async getUserList(data: UserModel): Promise<UserModel[]> {
    const res = await this.commands(AUTH_CMD.users, data);
    return res;
  }
  async changeUser() {}

  //Role Service
  async role_list(data: {}): Promise<Role[]> {
    return this.commands(AUTH_CMD.role_list, {});
  }

  async change_role(role: Role): Promise<void> {
    console.log(role);
    return this.commands(AUTH_CMD.change_role, role);
  }

  async validate_role(data: { user: UserModel }): Promise<Role> {
    return this.commands(AUTH_CMD.validate_role, data);
  }

  async get_Role(data: { user: UserModel }): Promise<Role> {
    return this.commands(AUTH_CMD.get_Role, data);
  }
}
