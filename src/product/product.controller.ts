// product.controller.ts
import { Controller, Post, Get, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { CreateProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post('/create')
    async createProduct(@Res() res, @Body() createProductDTO: CreateProductDTO) {
        if (!createProductDTO) {
            throw new BadRequestException('Invalid product data');
        }
        const product = await this.productService.createProduct(createProductDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Product Successfully created',
            product: product
        });
    }

    @Get('/')
    async getProducts(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('category') category: string,
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
        @Query('productName') productName: string,
    ) {
        const { data, total } = await this.productService.getProducts(page, limit, category, minPrice, maxPrice, productName);
        return { data, total };
    }

    @Get('/:productID')
    async getProductID(@Res() res, @Param('productID') productID: string) {
        try {
            const product = await this.productService.getProduct(productID);
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            throw new NotFoundException('Product not found');
        }
    }
    
    @Delete('/delete')
    async deleteProduct(@Res() res, @Query('productID') productID: string) {
        const productDeleted = await this.productService.deleteProduct(productID);
        if (!productDeleted) {
            throw new NotFoundException('Product not exist');
        }
        res.status(HttpStatus.OK).json({
            message: 'Product successfully deleted',
            productDeleted
        });
    }

    @Put('/update/:productID')
    async updateProduct(@Res() res, @Param('productID') productID: string, @Body() createProductDTO: CreateProductDTO) {
        if (!createProductDTO) {
            throw new BadRequestException('Invalid product data');
        }
        const updatedProduct = await this.productService.updateProduct(productID, createProductDTO);
        if (!updatedProduct) {
            throw new NotFoundException('Product not exist');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Product successfully updated',
            updatedProduct
        });
    }
}
