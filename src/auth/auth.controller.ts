import {
  AUTH_ROUTES,
  AuthTokens,
  type Role,
  type UserModel,
  Valid_User,
} from 'lib/WS_types/auth_service/main';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthDto,
  MainRegistrationUserDto,
  UpdateUserDto,
} from 'lib/WS_types/auth_service/auth.dto';
import { User_Role, UserId } from 'src/decoartors/userId';
import { JwtValidationGuard } from 'src/guards/auth.guards';

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
  async getUsers(@Query() data: UserModel): Promise<UserModel[]> {
    return this.authService.getUserList(data);
  }

  @Post(AUTH_ROUTES.USERS)
  async changeUser() {}

  // Roles
  @Get(AUTH_ROUTES.USERS + AUTH_ROUTES.ROLE)
  async role_list() {
    return this.authService.role_list({});
  }

  @Patch(AUTH_ROUTES.ROLE)
  async change_role(@Body() data: Role): Promise<void> {
    try {
      await this.authService.change_role(data);
    } catch (error) {}
  }

  @Get(AUTH_ROUTES.ROLE)
  get_Role(@Query() user: UserModel): Promise<Role> {
    return this.authService.get_Role({ user });
  }

  @UseGuards(JwtValidationGuard)
  @Get(AUTH_ROUTES.SIGN_IN + AUTH_ROUTES.ROLE)
  validate_role(@User_Role() role): Promise<Role> {
    return role;
  }
}
