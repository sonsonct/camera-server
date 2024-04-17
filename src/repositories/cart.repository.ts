import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Cart } from "src/database/entities/cart.entity";

@CustomRepository(Cart)
export class CartRepository extends TypeORMRepository<Cart> {
}
