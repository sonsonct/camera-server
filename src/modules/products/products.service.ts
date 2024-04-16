import { ProductsRepository } from 'src/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createProduct(createProductDto: CreateProductDto, img: Express.Multer.File) {
        const media = await this.cloudinaryService.uploadFile(img);
        createProductDto.image = media['url']
        return this.productsRepository.insert(createProductDto);
    }
}
