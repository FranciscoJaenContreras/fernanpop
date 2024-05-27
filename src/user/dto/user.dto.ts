import { IsDate, IsEmail, IsString } from "class-validator";

export class CreateUserDTO {
    @IsString()
    name: string;
    @IsString()
    password: string;
    @IsEmail()
    email: string;
    @IsDate()
    readonly createAt: Date;
}