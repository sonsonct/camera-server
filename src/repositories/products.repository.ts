import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Products } from "src/database/entities/product.entity";

@CustomRepository(Products)
export class ProductsRepository extends TypeORMRepository<Products> {

}
