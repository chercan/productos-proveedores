import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ResourceAlreadyExistsException } from '../common/exceptions/resource-already-exists';
import * as bcrypt from 'bcrypt';
import { ResourceNotFoundException } from '../common/exceptions/resource-not-found';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { userName: createUserDto.userName },
          { email: createUserDto.email },
        ],
      })
      .exec();

    if (existingUser?.toObject().userName === createUserDto.userName) {
      throw new ResourceAlreadyExistsException('User name already exists');
    }

    if (existingUser?.toObject().email === createUserDto.email) {
      throw new ResourceAlreadyExistsException('Email already exists');
    }

    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return createUser.save();
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().select('-password').exec();
    return users;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = await this.userModel.findOne({ userName }).exec();
    return user;
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new ResourceNotFoundException('User by id not found');
    }
    return user.toObject();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | ResourceNotFoundException> {
    const { password, ...userData } = updateUserDto;

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...userData,
          ...(hashedPassword && { password: hashedPassword }),
        },
        { new: true },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      return new ResourceNotFoundException('User for update not found');
    }
    return updatedUser.toObject();
  }

  async remove(id: string) {
    const userDeleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!userDeleted) {
      throw new ResourceNotFoundException('User for delete not found');
    }
    return { message: 'User deleted successfully' };
  }
}
