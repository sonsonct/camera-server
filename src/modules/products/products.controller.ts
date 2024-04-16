import { Body, Controller, FileTypeValidator, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('product')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) { }

    @ApiResponse({
        description: 'Create article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create article' })
    @ApiBody({ type: CreateProductDto })
    @UseInterceptors(FileInterceptor('img'))
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createArticle(
        @Body() body: CreateProductDto,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|mp4)' }),
            ],
        })) img: Express.Multer.File,
    ) {
        return await this.productsService.createProduct(body, img);
    }

}
