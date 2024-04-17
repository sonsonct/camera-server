import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-card.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @ApiResponse({
        description: 'Create cart success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create cart ' })
    @ApiBody({ type: CreateCartDto })
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createCart(@Body() createCartDto: CreateCartDto) {
        return await this.cartService.createCart(createCartDto);
    }

    @ApiResponse({
        description: 'Get cart success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get cart ' })
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getCart(
        @Param('id') id: number
    ) {
        return await this.cartService.selectCart(id);
    }

    @ApiResponse({
        description: 'Delete cart success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Delete cart ' })
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteCart(
        @Param('id') id: number
    ) {
        return await this.cartService.deleteCart(id);
    }
}
