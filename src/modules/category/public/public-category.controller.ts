import { CategoryService } from '../category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { GetListCategoryDto } from '../dto/get-list-category.dto';


@ApiTags('Categories-public')
@Controller('public/categories')
export class CategoryPublicController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @ApiResponse({
        description: 'Get list category  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get list category' })
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getListCategory(
        @Query() query: GetListCategoryDto,
    ) {
        return await this.categoryService.getListCategory(query);
    }

    @ApiResponse({
        description: 'Get all category  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get all category' })
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    async getAllCategory() {
        return await this.categoryService.getAllCategory();
    }

    @ApiResponse({
        description: 'Get sub category success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get sub category' })
    @Get('/parent/:id')
    @HttpCode(HttpStatus.OK)
    async getCategoryByParentId(
        @Param('id') id: number
    ) {
        return await this.categoryService.getCategoryByParentId(id);
    }
}
