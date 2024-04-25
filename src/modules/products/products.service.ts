import { ProductsRepository } from 'src/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GetListProductDto } from './dto/get-list-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async createProduct(createProductDto: CreateProductDto, image: Express.Multer.File) {
    const media = await this.cloudinaryService.uploadFile(image);
    createProductDto.image = media['url'];

    return this.productsRepository.insert(createProductDto);
  }

  async updateProduct(updateProductDto: CreateProductDto, image: Express.Multer.File, id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    updateProductDto.image = product.image;

    if (image) {
      const media = await this.cloudinaryService.uploadFile(image);
      updateProductDto.image = media['url'];
    }

    return this.productsRepository.update(id, updateProductDto);
  }

  async updateSaleProduct(updateProductDto: any, id: number) {
    const product = await this.productsRepository.findOneBy({ id });

    return this.productsRepository.update(id, { sale: updateProductDto.sale });
  }

  async deleteProduct(id: number) {
    return this.productsRepository.update(id, { deleted: true });
  }

  async detailProduct(id: number) {
    return await this.productsRepository.findOneBy({ id: id, deleted: false });
  }

  async listProduct(query: GetListProductDto) {
    return await this.productsRepository.getListProduct(query);
  }

  async listProductHot(query: GetListProductDto) {
    return await this.productsRepository.getListProductHot(query);
  }
}
