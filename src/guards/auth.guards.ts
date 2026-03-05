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
    console.log(JSON.parse(token));

    try {
      const user = await this.authService.validate(token);
      console.log(user);

      if (!user || !user.id) {
        return false;
      }
      return user;
    } catch (err) {
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    return request.headers.authorization.split(' ')[1];
  }
}
