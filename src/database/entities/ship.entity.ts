import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class Ship {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ nullable: false })
  cartId: number;

  @Column({ nullable: false })
  nameUser: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false, default: false })
  status: boolean;

  @ManyToOne(() => Cart, (cart) => cart.ship, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
}
