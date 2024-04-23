import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';
import { TypeORMRepository } from '../database/typeorm.repository';
import { Cart } from 'src/database/entities/cart.entity';
import { GetListCart } from 'src/modules/cart/dto/list-cart.dto';

@CustomRepository(Cart)
export class CartRepository extends TypeORMRepository<Cart> {
  async getCart(userId: number) {
    const queryBuilder = this.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.orders', 'orders')
      .leftJoinAndSelect('orders.product', 'product')
      .where('cart.userId =:userId', { userId: userId })
      .andWhere('cart.status = 0')
      .getMany();

    return queryBuilder;
  }

  async getAllCart(query: GetListCart) {
    const { searchKey, sortField = 'id', sortType = -1, page, pageSize } = query;
    const queryBuilder = this.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.ship', 'ship')
      .leftJoinAndSelect('cart.orders', 'orders')
      .leftJoinAndSelect('orders.product', 'product')
      .andWhere('cart.status != 0')

    queryBuilder.orderBy(`cart.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

    return this.list({ limit: pageSize, page: page }, { queryBuilder });
  }
}
