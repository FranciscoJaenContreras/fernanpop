
export class CreateProductDTO {

    title: string;

    description: string;

    price: number;
    
    image: string;

    readonly createAt: Date;
}