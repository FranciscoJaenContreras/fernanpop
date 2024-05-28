import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JWTPayload } from './interfaces/jwtPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...data } = createUserDto;
      const nuevoUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...data,
      });
      await nuevoUser.save();

      const { password: _new, ...userDevuelto } = nuevoUser.toJSON();
      return userDevuelto;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Wrong password');
    }
    const { password: _password, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJWT({ id: user.id }),
    };
  }

  async checkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userModel.findById(payload.id);
      return {
        user: user,
        token: this.getJWT({ id: user.id }),
      };
    } catch (error) {
      throw new BadRequestException('Token not valid');
    }
  }

  getJWT(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<User> {
    const { password, ...updateData } = updateAuthDto;
    if (password) {
      updateData['password'] = bcrypt.hashSync(password, 10);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password: _password, ...rest } = updatedUser.toJSON();
    return rest;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...rest } = deletedUser.toJSON();
    return rest;
  }
}
