import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';
import { TypeORMRepository } from '../database/typeorm.repository';
import { Products } from 'src/database/entities/product.entity';
import { GetListProductDto } from 'src/modules/products/dto/get-list-product.dto';

@CustomRepository(Products)
export class ProductsRepository extends TypeORMRepository<Products> {
  async getListProduct(query: GetListProductDto) {
    const {
      pageSize = 20,
      page = 1,
      category,
      searchKey,
      sortField = 'id',
      sortType = -1,
      categoryId,
      sale,
    } = query;

    const queryBuilder = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .where('products.deleted = :deleted', { deleted: false });

    if (searchKey) {
      queryBuilder.andWhere(
        'MATCH(products.productName, products.content) AGAINST(:dataSearch IN NATURAL LANGUAGE MODE) or category.categoryName LIKE :categoryName',
        {
          dataSearch: searchKey,
          categoryName: `%${searchKey}%`,
        },
      );
    }

    if (category) {
      queryBuilder.andWhere('category.categoryName = :categoryName', {
        categoryName: category,
      });
    }

    if (sale) {
      queryBuilder.andWhere('products.sale > 0');
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: categoryId,
      });
    }

    queryBuilder.orderBy(`products.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

    return this.list({ page: page, limit: pageSize }, { queryBuilder });
  }

  async getListProductHot(query: GetListProductDto) {
    const {
      pageSize = 20,
      page = 1,
      category,
      searchKey,
      sortField = 'id',
      sortType = -1,
      categoryId,
      sale,
    } = query;

    const queryBuilder = this.createQueryBuilder('products')
      .leftJoin('products.category', 'category')
      .leftJoin('products.orders', 'orders')
      .leftJoin('orders.cart', 'cart')
      .select([
        'products.id as id',
        'products.productName as productName',
        'sum(orders.total) as sum'
      ])
      .where('products.deleted = :deleted AND cart.status != 0', { deleted: false })
      .groupBy('orders.productId, products.Id')
      .orderBy('sum', 'DESC');

    if (searchKey) {
      queryBuilder.andWhere(
        'MATCH(products.productName, products.content) AGAINST(:dataSearch IN NATURAL LANGUAGE MODE) or category.categoryName LIKE :categoryName',
        {
          dataSearch: searchKey,
          categoryName: `%${searchKey}%`,
        },
      );
    }

    if (category) {
      queryBuilder.andWhere('category.categoryName = :categoryName', {
        categoryName: category,
      });
    }

    if (sale) {
      queryBuilder.andWhere('products.sale > 0');
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: categoryId,
      });
    }
    const totalItem = (await queryBuilder.getRawMany()).length;
    // queryBuilder.orderBy(`products.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');
    const data = await queryBuilder.limit(pageSize).offset((page - 1) * pageSize).getRawMany();

    return {
      data: data,
      totalItem: totalItem,
    };
  }
}
