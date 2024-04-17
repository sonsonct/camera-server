import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Products } from "./product.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    cartId: number;

    @Column({ nullable: true })
    productId: number;

    @Column({ nullable: true, default: 1 })
    total: number;

    @ManyToOne(() => Cart, cart => cart.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @ManyToOne(() => Products, product => product.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Products;
}