import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role, Valid_User } from 'lib/WS_types/auth_service/main';

export const UserId = createParamDecorator<string>(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user || !request.user.id) {
      throw new Error(
        'User is not authenticated. Use @UseGuards(JwtValidationGuard) before using @UserId().',
      );
    }
    return request.user.id;
  },
);

export const User = createParamDecorator<Valid_User>(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user || !request.user.id) {
      throw new Error(
        'User is not authenticated. Use @UseGuards(JwtValidationGuard) before using @UserId().',
      );
    }
    return request.user;
  },
);

export const User_Role = createParamDecorator<Role>(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.role || !request.role.id) {
      throw new Error('User without role !!');
    }
    return request.role;
  },
);
