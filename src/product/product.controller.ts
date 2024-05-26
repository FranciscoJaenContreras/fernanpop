import { Controller, Post, Get, Put, Patch, Delete, Res, HttpStatus, Body, Param, NotFoundException, Query } from '@nestjs/common';
import {CreateProductDTO} from './dto/product.dto'
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor( private readonly productService: ProductService) {}

    @Post('/create')
     async createPost(@Res() res, @Body() createProductDTO: CreateProductDTO){
        const product = await this.productService.createProduct(createProductDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Product Successfully created',
            product: product
        })
    }

    @Get('/')
    async getProducts(@Res() res) {
        const products = await this.productService.getProducts();
        return res.status(HttpStatus.OK).json(products);
    }


    @Get('/:productID')
    async getProductID(@Res() res, @Param('productID') productID: string){
        const product = await this.productService.getProduct(productID);
        if(!product) throw new NotFoundException('Product not found');
        res.status(HttpStatus.OK).json(product)
    }
    
    
    @Delete('/delete')
     async deleteProduct(@Res() res, @Query('productID') productID) {
        const productDeleted = await this.productService.deleteProduct(productID)
        if(!productDeleted) throw new NotFoundException('Product not exist');
        res.status(HttpStatus.OK).json({
            message: 'Product successfully deleted',
            productDeleted
        })
    }

    @Put('/update')
    async updateProduct(@Res() res , @Body() CreateProductDTO: CreateProductDTO, @Query('productID') productID) {
        const updatedProduct = await this.productService.updateProduct(productID, CreateProductDTO);
        if(!updatedProduct) throw new NotFoundException('Product not exist');
        res.status(HttpStatus.OK).json({
            message: 'Product successfully updated',
            updatedProduct
        })
    }


}
