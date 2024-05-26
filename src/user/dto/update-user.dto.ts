import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./user.dto";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
    name: string;
    password: string;
    email: string;
    readonly createAt: Date;
}
