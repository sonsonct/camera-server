import { ProductsRepository } from 'src/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GetListProductDto } from './dto/get-list-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createProduct(createProductDto: CreateProductDto, image: Express.Multer.File) {
        const media = await this.cloudinaryService.uploadFile(image);
        createProductDto.image = media['url']
        return this.productsRepository.insert(createProductDto);
    }

    async updateProduct(updateProductDto: CreateProductDto, image: Express.Multer.File, id: number) {
        const product = await this.productsRepository.findOneBy({ id });
        updateProductDto.image = product.image;

        if (image) {
            const media = await this.cloudinaryService.uploadFile(image);
            updateProductDto.image = media['url']
        }

        return this.productsRepository.update(id, updateProductDto);
    }

    async deleteProduct(id: number) {
        return this.productsRepository.update(id, { deleted: true });
    }

    async detailProduct(id: number) {
        return await this.productsRepository.findOneBy({ id: id, deleted: true });
    }

    async listProduct(query: GetListProductDto) {
        return await this.productsRepository.getListProduct(query);;
    }
}
