import { ProductsRepository } from 'src/repositories/products.repository';
import { CommentUserLikesDto } from './dto/create-likes-comment.dto';
import { CreateCommentDto, CreateReplyCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from '../../repositories/comment.repository';
import { Injectable } from '@nestjs/common';
import { ListCommentDto, ListSubCommentDto } from './dto/find-comment.dto';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { RoleScope, StatisticalType } from 'src/commons/enums';
import { UserRepository } from '../../repositories/user.repository';
import { Comment } from 'src/database/entities/comment.entity';


@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userRepository: UserRepository,
        private readonly productsRepository: ProductsRepository,
    ) { }

    async createComment(createCommentDto: CreateCommentDto, userId: number) {
        const product = await this.productsRepository.findOneBy({ id: createCommentDto.productId });

        const commentInsert = await this.commentRepository.insert({ productId: createCommentDto.productId, userId: userId, content: createCommentDto.content });

        return await this.commentRepository.getCommentById(commentInsert.identifiers[0].id);
    }

    async repComment(createReplyCommentDto: CreateReplyCommentDto, userId: number) {
        const { parentId } = createReplyCommentDto;
        const comment = await this.getCommentById(parentId);
        const product = await this.productsRepository.findOneBy({ id: comment.productId });
        const user = await this.userRepository.getUserInfo(userId);

        createReplyCommentDto.productId = comment.productId;


        const repCommentInsert = await this.commentRepository.insert({ productId: createReplyCommentDto.productId, userId: userId, content: createReplyCommentDto.content, parentId: createReplyCommentDto.parentId });

        return await this.commentRepository.getCommentById(repCommentInsert.identifiers[0].id);
    }

    async deleteComment(id: number, req: Request) {
        const comment = await this.getCommentById(id);

        if (comment.userId !== req['user'].id && req['user'].role !== RoleScope.ADMIN) {
            throw new httpBadRequest("YOU_NOT_AUTHOR_COMMENT");
        }


        const commentDelete = await this.commentRepository.update(id, { deleted: true });

        return commentDelete;
    }

    async getListComment(query: ListCommentDto) {

        return this.commentRepository.listComment(query);
    }

    async getListSubComment(query: ListSubCommentDto) {
        await this.checkExistedComment(query.parentId);

        return this.commentRepository.listSubComment(query);
    }

    async likeComment(commentUserLikesDto: CommentUserLikesDto) {
        const { commentId, userId } = commentUserLikesDto;
        const [comment, user, liked] = await Promise.all([
            this.getCommentById(commentId),
            this.userRepository.findOneBy({ id: userId }),
            this.commentRepository.checkLiked({ commentId, userId }),
        ]);

        const query = this.commentRepository
            .createQueryBuilder()
            .relation(Comment, 'likes')
            .of(comment);

        if (liked) {
            await query.remove(user);

        } else {
            await query.add(user);
        }

        return true;
    }

    async checkExistedComment(id: number) {
        const comment = await this.commentRepository.findOneBy({ id, deleted: false });

        if (!comment) {
            throw new httpNotFound("COMMENT_NOT_EXISTS");
        }

        return true;
    }

    async getCommentById(id: number) {
        const comment = await this.commentRepository.findOneBy({ id, deleted: false });

        if (!comment) {
            throw new httpNotFound("COMMENT_NOT_EXISTS");
        }

        return comment;
    }
}
