import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Products } from "src/database/entities/product.entity";
import { GetListProductDto } from "src/modules/products/dto/get-list-product.dto";

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
        } = query;

        const queryBuilder = this.createQueryBuilder('products')
            .leftJoinAndSelect('products.category', 'category')
            .where('category.deleted = :deleted', { deleted: false });

        if (searchKey) {
            queryBuilder.andWhere('MATCH(products.productName, products.content) AGAINST(:dataSearch IN NATURAL LANGUAGE MODE) or category.categoryName LIKE :categoryName', {
                dataSearch: searchKey,
                categoryName: `%${searchKey}%`
            });
        }


        if (category) {
            queryBuilder.andWhere('category.categoryName = :categoryName', {
                categoryName: category
            });
        }

        if (categoryId) {
            queryBuilder.andWhere('category.id = :categoryId', {
                categoryId: categoryId
            });
        }

        queryBuilder.orderBy(`products.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

        return queryBuilder.take(pageSize).skip((page - 1) * pageSize).getMany();
    }
}
