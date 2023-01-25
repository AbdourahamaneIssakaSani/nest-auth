import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto';
import { IUser, UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Sign up a user
   * @param dto
   * @returns
   */
  async signup(dto: CreateUserDto): Promise<IUser> {
    return await this.userService.create(dto);
  }

  /**
   * Log in a user
   * @param dto
   * @returns
   */
  async login(dto: LoginDto): Promise<{ user: IUser; token: string }> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
    }

    if (!user || !(await user.verifyPassword(password))) {
      throw new NotFoundException('Invalid credentials');
    }
    //  jsonwebtoken
    const token = '123456789';
    return { user, token };
  }

  // forgotPassword(dto: ForgotPasswordDto) {
  //   return `This action returns all auth`;
  // }

  // resetPassword(token: string, dto: ResetPasswordDto) {
  //   return `This action returns a auth`;
  // }

  // changePassword(id: string, dto: ChangePasswordDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // removeAccount(id: string) {
  //   return `This action removes a #${id} auth`;
  // }
}
