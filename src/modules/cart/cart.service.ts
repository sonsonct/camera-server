import { CartRepository } from './../../repositories/cart.repository';
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-card.dto';
import { Cart } from 'src/database/entities/cart.entity';
import { ProductsRepository } from 'src/repositories/products.repository';
import { OrderRepository } from 'src/repositories/order.repository';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productsRepository: ProductsRepository,
        private readonly orderRepository: OrderRepository
    ) { }
    async createCart(cart: CreateCartDto) {
        const { userId, ...productsId } = cart;
        const cartInsert = await this.cartRepository.insert(cart);

        productsId.productId.forEach(async (productId) => {
            await this.orderRepository.insert({ productId: productId, cartId: cartInsert.identifiers[0].id })
        })

        return cartInsert;
    }

    async selectCart(userId: number) {
        return await this.cartRepository.getCart(userId);
    }
}
