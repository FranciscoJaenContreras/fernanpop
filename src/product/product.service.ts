// product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async getProducts(page: number = 1, limit: number = 10, category?: string, minPrice?: number, maxPrice?: number, productName?: string): Promise<{ data: Product[], total: number }> {
        const filters: any = {};
        if (category) {
            filters.category = category;
        }
        if (minPrice !== undefined) {
            filters.price = { ...filters.price, $gte: minPrice };
        }
        if (maxPrice !== undefined) {
            filters.price = { ...filters.price, $lte: maxPrice };
        }
        if (productName) {
            filters.title = { $regex: new RegExp(productName, 'i') }; // Usar RegExp para construir la expresión regular
        }

        const skip = (page - 1) * limit;
        const productsQuery = this.productModel.find(filters).skip(skip).limit(limit);
        const products = await productsQuery.exec();
        const total = await this.productModel.countDocuments(filters).exec();

        return { data: products, total };
    }

    async getProduct(productID: string): Promise<Product> {
        const product = await this.productModel.findById(productID);
        return product;
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
        const product = new this.productModel(createProductDTO);
        return await product.save();
    }

    async deleteProduct(productID: string): Promise<Product> {
        if (!productID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new NotFoundException('Invalid productID');
        }
        const deletedProduct = await this.productModel.findByIdAndDelete(productID);
        if (!deletedProduct) {
            throw new NotFoundException('Product not found');
        }
        return deletedProduct;
    }

    async updateProduct(productID: string, createProductDTO: CreateProductDTO): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(productID, createProductDTO, { new: true });
        return updatedProduct;
    }
}
