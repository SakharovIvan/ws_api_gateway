import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
      request.user = user; 
      return true;
    } catch (err) {
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
