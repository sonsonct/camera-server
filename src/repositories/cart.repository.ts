import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';
import { TypeORMRepository } from '../database/typeorm.repository';
import { Cart } from 'src/database/entities/cart.entity';
import { GetListCart } from 'src/modules/cart/dto/list-cart.dto';
import { StatisticalDto } from 'src/modules/statistical/dto/statistical.dto';
import { httpBadRequest } from 'src/nest/exceptions/http-exception';
import { getDate, getEndDateBy, getFirstDateBy } from 'src/utils/date.util';
import { FilterStatisticalType } from 'src/commons/enums';
import * as moment from 'moment';

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

  async getStatistical(query: StatisticalDto) {
    let firstDay;
    let endDay;

    if (!query.firstDay && query.endDate || new Date(query.firstDay) > new Date(query.endDate) || new Date(query.firstDay) > new Date(getDate())) {
      throw new httpBadRequest("start date > end date");
    }

    if (query.firstDay && !query.endDate) {
      firstDay = query.firstDay;
      endDay = getDate();
    }

    if (query.firstDay && query.endDate) {
      firstDay = query.firstDay;
      endDay = query.endDate;
    }

    switch (query.filter) {
      case FilterStatisticalType.DAILY:
        firstDay = getDate() + " 00:00:00";
        endDay = getDate() + " 23:59:59";
        break;
      case FilterStatisticalType.WEEKLY:
        firstDay = getFirstDateBy('week');
        endDay = getEndDateBy('week');
        break;
      case FilterStatisticalType.MONTHLY:
        firstDay = getFirstDateBy('month');
        endDay = getEndDateBy('month');
        break;
      case FilterStatisticalType.YEARLY:
        firstDay = getFirstDateBy('year');
        endDay = getEndDateBy('year');
        break;
      default:
        break;
    }

    const statistical = await this.getStatisticalByDate(firstDay, endDay);

    return statistical.sum == null ? 0 : statistical.sum;
  }
  async getStatisticalFullMonth() {

    let statistical = [];

    // Lặp qua từng tháng trong năm (từ tháng 1 đến tháng 12)
    for (let month = 1; month <= 12; month++) {
      const endDayOfMonth = moment().set({ month: month - 1 }).endOf('month').format('DD');

      let monthlySum = 0;

      // Lặp qua từng ngày trong tháng và lấy dữ liệu thống kê
      for (let i = 1; i <= parseInt(endDayOfMonth); i++) {
        const fullDay = moment().set({ month: month - 1, date: i }).format('YYYY-MM-DD') + " 00:00:00";
        const endFullDay = moment().set({ month: month - 1, date: i }).format('YYYY-MM-DD') + " 23:59:59";
        const data = await this.getStatisticalByDate(fullDay, endFullDay);
        monthlySum += data.sum == null ? 0 : parseFloat(data.sum);
      }

      statistical.push({
        month: moment().set({ month: month - 1 }).format('YYYY-MM'),
        sum: monthlySum.toFixed(2)
      });
    }

    return statistical;
  }
  async getStatisticalByDate(firstDay: Date | string, endDay: Date | string) {
    const result = await this.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.ship', 'ship')
      .leftJoinAndSelect('cart.orders', 'orders')
      .leftJoinAndSelect('orders.product', 'product')
      .select([
        'SUM(product.price * orders.total - product.price * product.sale * orders.total / 100) as sum',
      ])
      .andWhere('cart.status != 0')
      .where('cart.updatedAt BETWEEN :startDate AND :endDate AND cart.status != 0', {
        startDate: firstDay,
        endDate: endDay
      });
    return result.getRawOne();
  }
}
