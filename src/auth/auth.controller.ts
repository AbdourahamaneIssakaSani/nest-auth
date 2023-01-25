import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Version,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createAuthDto: CreateUserDto) {
    return this.authService.signup(createAuthDto);
  }

  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginDetails = await this.authService.login(dto);
    // send fake token
    response.cookie('token', loginDetails.token);
    return loginDetails;
  }

  // @Post('forgot-pwd')
  // @HttpCode(HttpStatus.OK)
  // forgotPassword(@Body() dto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(dto);
  // }

  // @Patch('reset-pwd')
  // @HttpCode(HttpStatus.OK)
  // resetPassword(@Param('token') token: string, @Body() dto: ResetPasswordDto) {
  //   return this.authService.resetPassword(token, dto);
  // }

  // @Patch('change-pwd')
  // @HttpCode(HttpStatus.OK)
  // changePassword(@Param('id') id: string, dto: ChangePasswordDto) {
  //   return this.authService.changePassword(id, dto);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // removeAccount(@Param('id') id: string) {
  //   return this.authService.removeAccount(id);
  // }
}
