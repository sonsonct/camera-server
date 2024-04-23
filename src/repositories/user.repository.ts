import { TypeORMRepository } from '../database/typeorm.repository';
import { User } from '../database/entities/user.entity';
import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';
import { UserStatus } from 'src/commons/enums';
import { GetListUserDto } from 'src/modules/user/dto/list-user.dto';

@CustomRepository(User)
export class UserRepository extends TypeORMRepository<User> {
  async getUserInfo(id: number) {
    return await this.createQueryBuilder('user')
      .select(['user.username', 'user.email', 'user.avatar'])
      .where('user.id =:id', { id: id })
      .andWhere('user.status =:status', { status: UserStatus.ACTIVE })
      .getOne()
  }

  async getListUser(query: GetListUserDto, id: number) {
    const { searchKey, sortField = 'id', sortType = -1, page, pageSize } = query;
    const queryBuilder = this.createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.email', 'user.avatar', 'user.status', 'user.role'])
      .where('user.id != :id', { id: id }).andWhere('user.status != -1 and user.status != 0')
    if (searchKey) {
      queryBuilder.andWhere('user.username LIKE :searchKey or user.email LIKE :searchKey and user.status != -1 and user.status != 0', { searchKey: `%${searchKey}%` })
    }
    queryBuilder.orderBy(`user.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

    return this.list({ limit: pageSize, page: page }, { queryBuilder });
  }
}
