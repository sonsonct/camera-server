import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Category } from 'src/database/entities/category.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { Order } from './order.entity';



@Entity()
@Index('idx_title_content_fulltext', ['productName', 'content'], { fulltext: true })
export class Products {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    public categoryId: number;

    @Column({ type: 'varchar', length: '500', nullable: false })
    public productName: string;

    @Column({ type: 'bigint', nullable: false })
    public price: number;

    @Column({ type: 'text', nullable: true })
    public image: string;

    @Column({ type: 'text', nullable: false })
    public content: string;

    @Column({ nullable: false, default: 0 })
    public count: number;

    @Column({ nullable: false, default: false })
    public deleted: boolean;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @OneToMany(() => Comment, (comments) => comments.products)
    comments: Comment[]

    @OneToMany(() => Order, (orders) => orders.product)
    orders: Order[]
}
