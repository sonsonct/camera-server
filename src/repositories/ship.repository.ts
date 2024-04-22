import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';
import { TypeORMRepository } from '../database/typeorm.repository';
import { Ship } from 'src/database/entities/ship.entity';

@CustomRepository(Ship)
export class ShipRepository extends TypeORMRepository<Ship> {
  async getShip(userId: number) {
    const queryBuilder = this.createQueryBuilder('ship')
      .leftJoinAndSelect('ship.cart', 'cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.orders', 'orders')
      .leftJoinAndSelect('orders.product', 'product')
      .where('cart.userId =:userId', { userId: userId })
      .andWhere('ship.status= false')
      .getMany();

    return queryBuilder;
  }
}
