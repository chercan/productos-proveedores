import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  isAdmin: boolean;
  salt: number;
  admin: CreateUserDto;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.isAdmin = JSON.parse(this.configService.get('IS_ADMIN'));
    this.salt = JSON.parse(this.configService.get('SALTING_ROUNDS'));
    this.admin = {
      userName: this.configService.get<string>('USER_ADMIN'),
      password: this.configService.get<string>('PASSWORD_ADMIN'),
      email: this.configService.get<string>('EMAIL_ADMIN'),
    };
    if (this.isAdmin) {
      this.seedAdminUser();
    }
  }

  async seedAdminUser() {
    const existingUser = await this.userModel
      .findOne({
        $or: [{ userName: this.admin.userName }, { email: this.admin.email }],
      })
      .exec();

    if (!existingUser) {
      const { password, ...userData } = this.admin;
      const hashedPassword = await bcrypt.hash(password, this.salt);
      const createUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      return createUser.save();
    }
  }
}
