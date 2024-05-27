import { IsDate, IsNumber, IsString, isString } from "class-validator";


export class CreateProductDTO {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;
    
    @IsString()
    image: string;

    @IsString()
    category: string;

    @IsDate()
    readonly createAt: Date;
}