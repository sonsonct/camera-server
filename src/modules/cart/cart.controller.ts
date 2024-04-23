import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-card.dto';
import { CreateShipDto } from './dto/ship.dto';
import { GetListCart } from './dto/list-cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

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
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllCart(@Query() query: GetListCart,) {
    return await this.cartService.getAllCart(query);
  }

  @ApiResponse({
    description: 'Get cart success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Get cart ' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getCart(@Param('id') id: number) {
    return await this.cartService.selectCart(id);
  }

  @ApiResponse({
    description: 'Get cart success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Get cart ' })
  @Get('order/:id')
  @HttpCode(HttpStatus.OK)
  async getOrder(@Param('id') id: number) {
    return await this.cartService.selectOrderCart(id);
  }

  @ApiResponse({
    description: 'Update order success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Update order ' })
  @Put('order/:id')
  @HttpCode(HttpStatus.OK)
  async updateOrder(@Param('id') id: number, @Body() body: any) {
    return await this.cartService.updateOrderCart(id, body);
  }

  @ApiResponse({
    description: 'Confirm order success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Confirm order ' })
  @Put('order/confirm/:id')
  @HttpCode(HttpStatus.OK)
  async confirmOrder(@Param('id') id: number) {
    return await this.cartService.confirmOrderCart(id);
  }


  @ApiResponse({
    description: 'Get cart success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Get cart ' })
  @Post('ship')
  @HttpCode(HttpStatus.OK)
  async createShip(@Body() body: CreateShipDto) {
    return await this.cartService.createShip(body);
  }

  @ApiResponse({
    description: 'Get cart success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Get cart ' })
  @Get('ship/:id')
  @HttpCode(HttpStatus.OK)
  async getShip(@Param('id') id: number) {
    return await this.cartService.getShip(id);
  }

  @ApiResponse({
    description: 'Get cart success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Get cart ' })
  @Put('ship/:id')
  @HttpCode(HttpStatus.OK)
  async updateShip(@Param('id') id: number) {
    return await this.cartService.updateShip(id);
  }

  @ApiResponse({
    description: 'Delete cart success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Delete cart ' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCart(@Param('id') id: number) {
    return await this.cartService.deleteCart(id);
  }
}
