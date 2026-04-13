import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'lib/WS_types/auth_service/main';
import { AuthService } from 'src/auth/auth.service';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class JwtValidationGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      const token_scheme = await this.authService.validate(JSON.parse(token));
      if (!token_scheme || !token_scheme.id) {
        return false;
      }
      request.user = token_scheme;
      const userModel = await this.authService.validate_user_model_by_email(
        token_scheme.email,
      );
      try {
        const role = await this.authService.validate_role({ user: userModel });
        request.role = role;
      } catch (error) {
        const role: Partial<Role> = {
          role: 'guest',
          isadmin: false,
        };
        request.role = role;
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.slice(7); // Извлекаем токен без приставки "Bearer "
  }
}

@Injectable()
export class CustomerValidationGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      const token_scheme = await this.authService.validate(JSON.parse(token));
      if (!token_scheme || !token_scheme.id) {
        return false;
      }
      request.user = token_scheme;
      const userModel = await this.authService.validate_user_model_by_email(
        token_scheme.email,
      );
      const customer = await this.customerService.get({
        user_id: userModel.id,
      });
      request.customer = customer;
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.slice(7); // Извлекаем токен без приставки "Bearer "
  }
}
