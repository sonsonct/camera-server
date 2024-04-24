import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';
import { TypeORMRepository } from '../database/typeorm.repository';
import { Category } from '../database/entities/category.entity';
import { GetListCategoryDto } from '../modules/category/dto/get-list-category.dto';

@CustomRepository(Category)
export class CategoryRepository extends TypeORMRepository<Category> {
  async getListCategoryAdmin(query: GetListCategoryDto) {
    const { searchKey, sortField = 'id', sortType = -1 } = query;
    let queryBuilder;

    queryBuilder = this.createQueryBuilder('category').where('category.parentId IS NULL');

    if (searchKey) {
      queryBuilder = this.createQueryBuilder('category').where(
        '(category.categoryName LIKE :categoryName )',
        {
          categoryName: `%${searchKey}%`,
        },
      );
    }

    queryBuilder.orderBy(`category.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

    return await queryBuilder.getMany();
  }

  async getListCategory(query: GetListCategoryDto) {
    const { searchKey, sortField = 'id', sortType = -1 } = query;
    let queryBuilder;

    queryBuilder = this.createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .where('category.parentId IS NULL');

    if (searchKey) {
      queryBuilder = this.createQueryBuilder('category').where(
        '(category.categoryName LIKE :categoryName )',
        {
          categoryName: `%${searchKey}%`,
        },
      );
    }

    queryBuilder
      .orderBy(`category.${sortField}`, sortType > 0 ? 'ASC' : 'DESC')
      .addOrderBy(`subCategories.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

    return await queryBuilder.getMany();
  }

  async getCategoryByParentId(parentId: number) {
    const queryBuilder = this.createQueryBuilder('category')
      .where('category.parentId = :parentId', { parentId })
      .orderBy('category.order', 'DESC');

    return await queryBuilder.getMany();
  }

  async getAllCategory() {
    return this.createQueryBuilder('category')
      .select(['category.id', 'category.categoryName'])
      .getMany();
  }

  async getCountProductCategory() {
    return this.createQueryBuilder('category')
      .leftJoin('category.products', 'products')
      .select(['category.categoryName as categoryName', 'count(products.id) as count'])
      .groupBy('category.id')
      .getRawMany();
  }
}
