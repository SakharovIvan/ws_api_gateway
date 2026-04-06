import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'lib/WS_types/auth_service/main';
import { AuthService } from 'src/auth/auth.service';

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
      const user = await this.authService.validate(JSON.parse(token));
      if (!user || !user.id) {
        return false;
      }
      console.log(user);
      request.user = user;

      try {
        const role = await this.authService.validate_role({ user });
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
