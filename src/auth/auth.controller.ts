import {
  AUTH_ROUTES,
  AuthTokens,
  UserModel,
} from 'lib/WS_types/auth_service/main';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthDto,
  MainRegistrationUserDto,
  UpdateUserDto,
} from 'lib/WS_types/auth_service/auth.dto';
import { Request } from 'express';

@Controller(AUTH_ROUTES.MAIN)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.SIGN_UP)
  async registration(@Body() createUser: MainRegistrationUserDto) {
    return this.authService.registration(createUser);
  }

  @Post(AUTH_ROUTES.SIGN_IN)
  async login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @Get(AUTH_ROUTES.SIGN_OUT)
  async signout(@Headers() token: string) {
    this.authService.logout(token);
  }

  @Get(AUTH_ROUTES.REFRESH_TOKEN)
  async refresh(@Headers() token: string): Promise<AuthTokens> {
    return this.authService.refresh(token);
  }

  @Get(AUTH_ROUTES.ACTIVATION_LINK)
  async activateUser(@Headers() token: string) {
    this.authService.activate(token);
  }

  @Post(AUTH_ROUTES.PASSWORD_RESET + '/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() newUser: UpdateUserDto,
  ) {}

  @Post(AUTH_ROUTES.PASSWORD_RESET)
  async sentResetPasswordLink(@Body() data: { email: string }) {}

  @Get(AUTH_ROUTES.USERS)
  async getUsers(): Promise<UserModel[]> {
    return this.authService.getUserList();
  }

  @Post(AUTH_ROUTES.USERS)
  async changeUser() {}
}
