import { AUTH_ROUTES } from 'lib/WS_types/auth_service/main';
import { AuthService } from './auth.service';
import {
  Controller,
  Redirect,
  Post,
  Get,
  Req,
  HttpStatus,
} from '@nestjs/common';

@Controller(AUTH_ROUTES.MAIN)
export class AuthController {
      constructor(private readonly authService: AuthService) {}

    @Post(AUTH_ROUTES.REGISTRATION) 
    async registration() {
        
    }
    
    @Get(AUTH_ROUTES.LOGIN)
    async login() {
        
    }

    
}
