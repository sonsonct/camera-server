import { CartRepository } from './../../repositories/cart.repository';
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-card.dto';
import { ProductsRepository } from 'src/repositories/products.repository';
import { OrderRepository } from 'src/repositories/order.repository';
import { ShipRepository } from 'src/repositories/ship.repository';
import { CreateShipDto } from './dto/ship.dto';
import { GetListCart } from './dto/list-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly orderRepository: OrderRepository,
    private readonly shipRepository: ShipRepository,
  ) { }

  async createShip(createShipDto: CreateShipDto) {
    return await this.shipRepository.insert(createShipDto);
  }

  async getShip(userId: number) {
    return await this.shipRepository.getShip(userId);
  }

  async updateShip(id: number) {
    const ship = await this.shipRepository.findOneBy({ id });

    await this.cartRepository.update({ id: ship.cartId }, { status: 1 });
    return await this.shipRepository.update({ id }, { status: true });
  }

  async createCart(createCartDto: CreateCartDto) {
    const { userId, ...productsId } = createCartDto;
    const cart = await this.cartRepository.findOneBy({ userId: userId, status: 0 });
    console.log(cart);
    let cartId;
    if (!cart) {
      const cartInsert = await this.cartRepository.insert(createCartDto);
      cartId = cartInsert.identifiers[0].id;
    } else {
      cartId = cart.id;
    }

    productsId.productId.forEach(async (productId) => {
      const existProduct = await this.orderRepository.findOneBy({
        cartId: cartId,
        productId: productId,
      });

      if (!existProduct) {
        await this.orderRepository.insert({ cartId: cartId, productId: productId });
      } else {
        await this.orderRepository.update(
          { cartId: cartId, productId: productId },
          { total: existProduct.total + 1 },
        );
      }
    });

    return true;
  }

  async selectCart(userId: number) {
    return await this.cartRepository.getCart(userId);
  }

  async getAllCart(query: GetListCart) {
    return await this.cartRepository.getAllCart(query);
  }

  async selectOrderCart(id: number) {
    return await this.orderRepository.findOneBy({ id });
  }


  async updateOrderCart(id: number, body: any) {
    const order = await this.orderRepository.findOneBy({ id });
    //console.log(body);
    if (order.total + body.total == 0) {
      return await this.orderRepository.delete({ id });
    }
    return await this.orderRepository.update({ id }, { total: order.total + body.total });
  }

  async confirmOrderCart(id: number) {
    return await this.cartRepository.update({ id }, { status: 2 });
  }

  async deleteCart(id: number) {
    return await this.orderRepository.delete({ id });
  }
}
