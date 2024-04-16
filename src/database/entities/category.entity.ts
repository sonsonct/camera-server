
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from "./product.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    parentId: number;

    @Column({ nullable: false, type: "varchar", length: 255, unique: true })
    categoryName: string;

    @Column({ type: 'bigint', nullable: true })
    order: number;

    @ManyToOne(() => Category, (category) => category.subCategories, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parentCategory: Category;

    @OneToMany(() => Category, (category) => category.parentCategory, { nullable: true })
    subCategories: Category[];

    @OneToMany(() => Products, (products) => products.category)
    products: Products[]
}

