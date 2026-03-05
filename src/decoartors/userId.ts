import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
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
