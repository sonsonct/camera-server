import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { Comment } from "../database/entities/comment.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";
import { ListAllCommentDto, ListCommentDto, ListSubCommentDto } from "../modules/comment/dto/find-comment.dto";

@CustomRepository(Comment)
export class CommentRepository extends TypeORMRepository<Comment> {
    async listAllComment(query: ListAllCommentDto) {
        const { cursor, pageSize } = query;
        const queryBuilder = this.createQueryBuilder('comment')
            .leftJoin("comment.products", "products")
            .leftJoin("comment.user", "user")
            .leftJoin("comment.likes", "likes")
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .select([
                'comment',
                'products',
                'user.id',
                'user.username',
                'user.avatar',
                'likes.id',
                'likes.username',
                'likes.avatar'
            ])
            .andWhere("comment.deleted = false")
            .orderBy('comment.id', "DESC");

        if (cursor) {
            queryBuilder.andWhere("comment.id < :cursor", { cursor });
        }

        return this.listCursor(queryBuilder, pageSize);
    }


    async listComment(query: ListCommentDto) {
        const { cursor, pageSize, productId } = query;
        const queryBuilder = this.createQueryBuilder('comment')
            .leftJoin("comment.products", "products")
            .leftJoin("comment.user", "user")
            .leftJoin("comment.likes", "likes")
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .loadRelationCountAndMap('comment.subCommentCount', 'comment.subComments')
            .select([
                'comment',
                'user.id',
                'user.username',
                'user.avatar',
                'likes.id',
                'likes.username',
                'likes.avatar'
            ])
            .where('comment.parentId IS NULL')
            .andWhere("comment.deleted = false")
            .andWhere("products.id = :productId", { productId: productId })
            .orderBy('comment.id', "DESC");

        if (cursor) {
            queryBuilder.andWhere("comment.id < :cursor", { cursor });
        }

        return this.listCursor(queryBuilder, pageSize);
    }

    async listSubComment(query: ListSubCommentDto) {
        const { cursor, pageSize, parentId } = query;
        const queryBuilder = this.createQueryBuilder('comment')
            .leftJoin('comment.likes', 'likes')
            .leftJoin("comment.user", "user")
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .select([
                'comment',
                'user.id',
                'user.username',
                'user.avatar',
                'likes.id',
                'likes.username',
                'likes.avatar'
            ])
            .andWhere('comment.parentId = :parentId', { parentId: parentId })
            .andWhere('comment.deleted = false')
            .orderBy('comment.id', 'DESC')

        if (cursor) {
            queryBuilder.andWhere("comment.id < :cursor", { cursor });
        }

        return this.listCursor(queryBuilder, pageSize);
    }

    async checkLiked({ commentId, userId }) {
        return this.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.likes', 'user')
            .where('comment.id = :commentId', { commentId: commentId })
            .andWhere('user.id = :userId', { userId: userId })
            .getOne();
    }

    async getCommentById(commentId: number) {
        return this.createQueryBuilder('comment')
            .leftJoin("comment.products", "products")
            .leftJoin("comment.user", "user")
            .leftJoin("comment.likes", "likes")
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .loadRelationCountAndMap('comment.subCommentCount', 'comment.subComments')
            .select([
                'comment',
                'user.id',
                'user.username',
                'user.avatar',
                'likes.id',
                'likes.username',
                'likes.avatar'
            ])
            .andWhere("comment.id = :commentId", { commentId: commentId })
            .getOne();
    }
}