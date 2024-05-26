import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async getProducts(): Promise<Product[]> {
        const products = await this.productModel.find();
        return products;
    }

    async getProduct(productID: string): Promise<Product>{
        const product = await this.productModel.findById(productID);
        return product;
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<Product>{
        const product = new this.productModel(createProductDTO);
        return await product.save();
    }

    async deleteProduct(productID: string): Promise<Product>{
        // Validar si el ID es un ObjectId válido
        if (!productID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new NotFoundException('Invalid productID');
        }
        const deletedProduct = await this.productModel.findByIdAndDelete(productID);
        if (!deletedProduct) {
            throw new NotFoundException('Product not found');
        }
        return deletedProduct;
    }

    async updateProduct(productID:string, createProductDTO:CreateProductDTO):Promise<Product>{
        const updatedProduct = await this.productModel.findByIdAndUpdate(productID, createProductDTO);
        return updatedProduct;
    }
}
