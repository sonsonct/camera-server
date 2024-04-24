import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetListCategoryDto } from './dto/get-list-category.dto';
import { httpNotFound } from 'src/nest/exceptions/http-exception';
import { IsNull, Not } from 'typeorm';
import { ChangeOrderDto } from './dto/change-order.dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        if (createCategoryDto.parentId) {
            const parentCategory = await this.categoryRepository.findOneBy({ id: createCategoryDto.parentId, parentId: IsNull() });
            if (!parentCategory) {
                throw new httpNotFound("This category parent not found");
            }
        }

        const category = await this.categoryRepository.findOneBy({ categoryName: createCategoryDto.categoryName });

        if (category) {
            throw new httpNotFound("This category already exists, please enter another one");
        }

        const categoryInsert = await this.categoryRepository.insert(createCategoryDto);

        await this.categoryRepository.update({ id: categoryInsert.identifiers[0].id }, { order: categoryInsert.identifiers[0].id })

        return categoryInsert;
    }

    async updateCategory(id: number, updateCategoryDto: CreateCategoryDto) {
        await this.checkExitsCategory(id);

        const existedCategoryName = await this.categoryRepository.findOne({
            where: {
                categoryName: updateCategoryDto.categoryName,
                id: Not(id)
            }
        });

        if (existedCategoryName) {
            throw new httpNotFound("This category already exists, please enter another one");
        }

        return await this.categoryRepository.update(id, { categoryName: updateCategoryDto.categoryName });
    }

    async deleteCategory(id: number) {
        await this.checkExitsCategory(id);
        return await this.categoryRepository.delete({ id });
    }

    async getListCategory(query: GetListCategoryDto) {
        return await this.categoryRepository.getListCategory(query);
    }

    async getListCategoryAdmin(query: GetListCategoryDto) {
        return await this.categoryRepository.getListCategoryAdmin(query);
    }

    async getAllCategory() {
        return await this.categoryRepository.getAllCategory();
    }

    async getCountProductCategory() {
        return await this.categoryRepository.getCountProductCategory();
    }

    async getCategoryByParentId(parentId: number) {
        await this.checkExitsCategory(parentId);

        return await this.categoryRepository.getCategoryByParentId(parentId);
    }

    async changeOrder(changeOrderDto: ChangeOrderDto) {
        const { categoryId1, categoryId2 } = changeOrderDto;

        const [category1, category2] = await Promise.all([
            await this.getCategoryById(categoryId1),
            await this.getCategoryById(categoryId2)
        ]);

        await Promise.all([
            this.categoryRepository.update({ id: category1.id }, { order: category2.order }),
            this.categoryRepository.update({ id: category2.id }, { order: category1.order })
        ]);

        //TO-DO: use nestjs post intorcepter to handle format response
        return true;
    }

    async checkExitsCategory(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new httpNotFound("CATEGORY_NOT_FOUND");
        }

        return true;
    }

    async getCategoryById(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new httpNotFound("CATEGORY_NOT_FOUND");
        }

        return category;
    }
}
