import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

    async getUsers(): Promise<User[]> {
        return await this.UserModel.find().exec();
    }

    async getUser(UserID: string): Promise<User>{
        return await this.UserModel.findById(UserID).exec();
    }

    async createUser(createUserDTO: CreateUserDTO): Promise<User>{
        const createdUser = new this.UserModel(createUserDTO);
        return await createdUser.save();
    }

    async deleteUser(UserID: string): Promise<User>{
        if (!UserID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new NotFoundException('Invalid UserID');
        }
        const deletedUser = await this.UserModel.findByIdAndDelete(UserID).exec();
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return deletedUser;
    }

    async updateUser(UserID: string, updateUserDTO: CreateUserDTO): Promise<User>{
        const updatedUser = await this.UserModel.findByIdAndUpdate(UserID, updateUserDTO, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser;
    }
    async disableUser(UserID: string): Promise<User>{
        const disabledUser = await this.UserModel.findByIdAndUpdate(UserID, { disabled: true }, { new: true }).exec();
        if (!disabledUser) {
            throw new NotFoundException('User not found');
        }
        return disabledUser;
    }
}
