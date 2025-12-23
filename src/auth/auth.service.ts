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
  UserModel,
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
  async getUserList(): Promise<UserModel[]> {
    return this.commands(AUTH_CMD.users, {});
  }
  async changeUser() {}
}
