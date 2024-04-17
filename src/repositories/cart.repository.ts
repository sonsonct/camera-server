import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Cart } from "src/database/entities/cart.entity";

@CustomRepository(Cart)
export class CartRepository extends TypeORMRepository<Cart> {
    async getCart(userId: number) {
        const queryBuilder = this.createQueryBuilder('cart')
            .leftJoinAndSelect('cart.user', 'user')
            .leftJoinAndSelect('cart.orders', 'orders')
            .leftJoinAndSelect('orders.product', 'product')
            .where('cart.userId =:userId', { userId: userId })
            .getMany();

        return queryBuilder;
    }
}
