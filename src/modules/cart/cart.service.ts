import { CartRepository } from './../../repositories/cart.repository';
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-card.dto';
import { Cart } from 'src/database/entities/cart.entity';
import { ProductsRepository } from 'src/repositories/products.repository';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productsRepository: ProductsRepository
    ) { }
    async createCart(cart: CreateCartDto) {
        const { userId, ...productsId } = cart;
        const cartInsert = await this.cartRepository.insert(cart);

        const dataCart = await this.cartRepository.findOneBy({ id: cartInsert.identifiers[0].id })

        productsId.productId.forEach(async (productId) => {
            const product = await this.productsRepository.findOneBy({ id: productId });
            await this.cartRepository
                .createQueryBuilder()
                .relation(Cart, 'products')
                .of(dataCart).add(product);
        })

        return dataCart;
    }
}
