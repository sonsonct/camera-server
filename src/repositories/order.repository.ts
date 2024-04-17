import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Order } from "src/database/entities/order.entity";

@CustomRepository(Order)
export class OrderRepository extends TypeORMRepository<Order> {
}
