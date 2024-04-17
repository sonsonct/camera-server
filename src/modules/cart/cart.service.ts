import { CartRepository } from './../../repositories/cart.repository';
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-card.dto';
import { ProductsRepository } from 'src/repositories/products.repository';
import { OrderRepository } from 'src/repositories/order.repository';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productsRepository: ProductsRepository,
        private readonly orderRepository: OrderRepository
    ) { }
    async createCart(createCartDto: CreateCartDto) {
        const { userId, ...productsId } = createCartDto;
        const cart = await this.cartRepository.findOneBy({ userId: userId })

        let cartId;
        if (!cart) {
            const cartInsert = await this.cartRepository.insert(createCartDto);
            cartId = cartInsert.identifiers[0].id

        } else {
            cartId = cart.id

        }

        productsId.productId.forEach(async (productId) => {
            const existProduct = await this.orderRepository.findOneBy({ cartId: cartId, productId: productId });

            if (!existProduct) {
                await this.orderRepository.insert({ cartId: cartId, productId: productId });
            } else {
                await this.orderRepository.update({ cartId: cartId, productId: productId }, { total: existProduct.total + 1 });
            }
        })

        return true;
    }

    async selectCart(userId: number) {
        return await this.cartRepository.getCart(userId);
    }
}
