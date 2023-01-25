import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, IUserMethods, UserModel } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private userModel: UserModel) {}

  async create(dto: CreateUserDto): Promise<IUser> {
    return await new this.userModel(dto).save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(
    email: string,
  ): Promise<HydratedDocument<IUser, IUserMethods>> {
    return await this.userModel.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
