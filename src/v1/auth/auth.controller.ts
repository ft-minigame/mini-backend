import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/domain/services/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('/oauth/callback')
  async callback(@Query('code') code: string) {
    const { access_token: accessToken } = await this.authService.getToken(code);
    const profile = await this.authService.getProfile(accessToken);
    const user = await this.usersService.findOrCreate(profile.intraId);
    const jwt = this.jwtService.sign({
      sub: user.id,
      username: user.intraId,
    });

    return {
      jwt,
      user: {
        intraId: user.intraId,
      },
    };
  }
}