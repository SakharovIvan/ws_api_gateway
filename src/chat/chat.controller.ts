import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
  Body,
  HttpException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat, Message } from 'lib/WS_types/chat/chat.interface';
import { JwtValidationGuard } from 'src/guards/auth.guards';
import { User } from 'src/decoartors/userId';
import type { Valid_User } from 'lib/WS_types/auth_service/main';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('')
  createChat(data: Partial<Chat>): Promise<void> {
    return this.chatService.createChat(data);
  }

  @UseGuards(JwtValidationGuard)
  @Post('/message')
  sendMessage(
    @User() valid: Valid_User,
    @Body() data: Partial<Message>,
  ): Promise<void> {
    return this.chatService.sendMessage({
      ...data,
      userid: valid.id,
      username: valid.user,
    });
  }

  @UseGuards(JwtValidationGuard)
  @Patch('/message')
  patchMessage(
    @User() valid: Valid_User,
    @Body() data: Message[],
  ): Promise<void> {
    if (data.length !== 2) {
      throw new HttpException('Forbidden Too long patch array', 403);
    }
    if (data[0].username !== valid.user || data[1].username !== valid.user) {
      throw new HttpException(
        'Wrong user_id, this user cnat patch this messgae',
        400,
      );
    }
    return this.chatService.patchMessage(data);
  }

  @Get('/message' + '/:path')
  getMessages(@Param('path') path: string): Promise<Message[] | null> {
    return this.chatService.getMessages({ path });
  }

  @Get('' + '/:path')
  getChat(@Param('path') path: string): Promise<Chat | null> {
    return this.chatService.getChat({ path });
  }
}
