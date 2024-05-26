import { Body, Controller, Get, HttpStatus, Param, Post, Res, NotFoundException, BadRequestException, Put, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('/')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('/createuser')
    async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
        try {
            const user: User = await this.userService.createUser(createUserDTO);
            return res.status(HttpStatus.OK).json({
                message: 'User successfully created',
                user,
            });
        } catch (error) {
            throw new BadRequestException('Could not create user: ' + error.message);
        }
    }

    @Get('/users')
    async getUsers(@Res() res) {
        try {
            const users: User[] = await this.userService.getUsers();
            return res.status(HttpStatus.OK).json(users);
        } catch (error) {
            throw new NotFoundException('Could not fetch users: ' + error.message);
        }
    }

    @Get('/:userID')
    async getUserById(@Res() res, @Param('userID') userID: string) {
        try {
            const user: User = await this.userService.getUser(userID);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            throw new NotFoundException('Could not fetch user: ' + error.message);
        }
    }

    @Put('/update/:userID')
    async updateUser(@Res() res, @Param('userID') userID: string, @Body() updateUserDTO: UpdateUserDTO) {
        try {
            const updatedUser: User = await this.userService.updateUser(userID, updateUserDTO);
            if (!updatedUser) {
                throw new NotFoundException('User not found');
            }
            return res.status(HttpStatus.OK).json({
                message: 'User successfully updated',
                updatedUser,
            });
        } catch (error) {
            throw new BadRequestException('Could not update user: ' + error.message);
        }
    }
    
    @Delete('/delete/:userID')
    async deleteUser(@Res() res, @Param('userID') userID: string) {
        try {
            const deletedUser: User = await this.userService.deleteUser(userID);
            if (!deletedUser) {
                throw new NotFoundException('User not found');
            }
            return res.status(HttpStatus.OK).json({
                message: 'User successfully deleted',
                deletedUser,
            });
        } catch (error) {
            throw new BadRequestException('Could not delete user: ' + error.message);
        }
    }

    @Patch('/disable/:userID')
    async disableUser(@Res() res, @Param('userID') userID: string) {
        try {
            const disabledUser: User = await this.userService.disableUser(userID);
            if (!disabledUser) {
                throw new NotFoundException('User not found');
            }
            return res.status(HttpStatus.OK).json({
                message: 'User successfully disabled',
                disabledUser,
            });
        } catch (error) {
            throw new BadRequestException('Could not disable user: ' + error.message);
        }
    }
}
