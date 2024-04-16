import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoleScope, UserStatus } from '../../commons/enums';
import { Comment } from 'src/database/entities/comment.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'varchar', length: '500' })
  public username: string;

  @Column({ type: 'varchar', length: '320', nullable: true })
  public email: string;

  @Column({ type: 'varchar', nullable: true })
  public avatar?: string;

  @Column({ type: 'varchar', length: '20', default: RoleScope.USER })
  public role: string;

  @Column({ type: 'varchar', nullable: true })
  public password: string;

  @Column({ type: 'int', default: UserStatus.ACTIVE })
  public status: number;

  @OneToMany(() => Comment, (comments) => comments.user)
  comments: Comment[]
}
