import { CategoryService } from '../category.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { GetListCategoryDto } from '../dto/get-list-category.dto';
import { RoleScope } from 'src/commons/enums';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
import { ChangeOrderDto } from '../dto/change-order.dto';


@ApiTags('Categories-admin')
@ApplyAuthGuard()
@SetRoles(RoleScope.ADMIN)
@Controller('admin/categories')
export class CategoryAdminController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @ApiResponse({
        description: 'Create category success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create category ' })
    @ApiBody({ type: CreateCategoryDto })
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoryService.createCategory(createCategoryDto);
    }

    @ApiResponse({
        description: 'Change order category  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Change order category ' })
    @ApiBody({ type: ChangeOrderDto })
    @Put('/change-order')
    @HttpCode(HttpStatus.OK)
    async changeOrder(
        @Body() changeOrder: ChangeOrderDto
    ) {
        return await this.categoryService.changeOrder(changeOrder);
    }

    @ApiResponse({
        description: 'Update category  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Update category ' })
    @ApiBody({ type: CreateCategoryDto })
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updateCategory(
        @Param('id') id: number,
        @Body() updateCategoryDto: CreateCategoryDto
    ) {
        return await this.categoryService.updateCategory(id, updateCategoryDto);
    }

    @ApiResponse({
        description: 'Delete category success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Delete category ' })
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteCategory(
        @Param('id') id: number,
    ) {
        return await this.categoryService.deleteCategory(id);
    }

    @ApiResponse({
        description: 'Get list category  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get list category' })
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getListCategoryAdmin(
        @Query() query: GetListCategoryDto,
    ) {
        return await this.categoryService.getListCategoryAdmin(query);
    }

    @ApiResponse({
        description: 'Get all category  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get all category' })
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    async getAllCategoryAdmin() {
        return await this.categoryService.getAllCategory();
    }

    @ApiResponse({
        description: 'Get sub category success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get sub category' })
    @Get('/parent/:id')
    @HttpCode(HttpStatus.OK)
    async getCategoryByParentIdAdmin(
        @Param('id') id: number,
    ) {
        return await this.categoryService.getCategoryByParentId(id);
    }
}
