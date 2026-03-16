import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Chat, Message } from 'lib/WS_types/chat/chat.interface';
import { CHAT, chat_func } from 'lib/WS_types/chat/chat.routes';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService implements chat_func {
  constructor(
    @Inject('CHAT_SERVICE')
    private readonly chatService: ClientProxy,
  ) {}

  async createChat(data: Partial<Chat>): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.chatService.send(CHAT.createChat, data),
      ).catch((err) => {
        throw new HttpException(err.message, err.status | 400);
      });
      return res;
    } catch (error) {
      return error;
    }
  }

  async sendMessage(data: Partial<Message>): Promise<void> {
    const res = await lastValueFrom(
      this.chatService.send(CHAT.sendMessage, data),
    ).catch((err) => {
      throw new HttpException(err.message, err.status | 400);
    });
    return res;
  }

  async patchMessage(data: Message[]): Promise<void> {
    const res = await lastValueFrom(
      this.chatService.send(CHAT.patchMessage, data),
    ).catch((err) => {
      throw new HttpException(err.message, err.status | 400);
    });
    return res;
  }

  async getMessages(data: { path: string }): Promise<Message[] | null> {
    const res = await lastValueFrom(
      this.chatService.send(CHAT.getMessages, data),
    ).catch((err) => {
      throw new HttpException(err.message, err.status | 400);
    });
    return res;
  }

  async getChat(data: { path: string }): Promise<Chat | null> {
    const res = await lastValueFrom(
      this.chatService.send(CHAT.getChats, data),
    ).catch((err) => {
      throw new HttpException(err.message, err.status | 400);
    });
    return res;
  }
}
