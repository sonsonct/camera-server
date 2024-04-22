import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { Ship } from './ship.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true, default: 0 })
  status: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Order, (orders) => orders.cart)
  orders: Order[];

  @OneToMany(() => Ship, (ship) => ship.cart)
  ship: Ship[];
}
