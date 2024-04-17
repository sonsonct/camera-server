import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetListProductDto } from './dto/get-list-product.dto';

@ApiTags('product')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) { }

    @ApiResponse({
        description: 'Create product success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create product' })
    @ApiBody({ type: CreateProductDto })
    @UseInterceptors(FileInterceptor('image'))
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createProduct(
        @Body() body: CreateProductDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        return await this.productsService.createProduct(body, image);
    }

    @ApiResponse({
        description: 'Create product success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create product' })
    @ApiBody({ type: CreateProductDto })
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateProduct(
        @Param("id") id: number,
        @Body() body: CreateProductDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        return await this.productsService.updateProduct(body, image, id);
    }

    @ApiResponse({
        description: 'delete product success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'delete product' })
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteProduct(
        @Param("id") id: number,
    ) {
        return await this.productsService.deleteProduct(id);
    }

    @ApiResponse({
        description: 'detail product success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'detail product' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async detailProduct(
        @Param("id") id: number,
    ) {
        return await this.productsService.detailProduct(id);
    }

    @ApiResponse({
        description: 'list product success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'list product' })
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getListProduct(
        @Query() query: GetListProductDto,
    ) {
        return await this.productsService.listProduct(query);
    }
}
