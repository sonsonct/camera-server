import { CommentUserLikesDto } from './dto/create-likes-comment.dto';
import { CreateCommentDto, CreateReplyCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from '../../repositories/comment.repository';
import { Injectable } from '@nestjs/common';
import { ListCommentDto, ListSubCommentDto } from './dto/find-comment.dto';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { NotificationType, RoleScope, StatisticalType } from 'src/commons/enums';
import { UserRepository } from '../../repositories/user.repository';
import { Comment } from 'src/database/entities/comment.entity';
import { StatisticalRepository } from 'src/repositories/statistical.repository';


@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userRepository: UserRepository,
        private readonly statisticalRepository: StatisticalRepository,
    ) { }

    async createComment(createCommentDto: CreateCommentDto, userId: number) {
        // const article = await this.getArticleById(createCommentDto.articleId);

        // if (article.authorId != userId) {
        //     const user = await this.userRepository.getUserInfo(userId);

        //     const data = {
        //         article: article,
        //         receiverId: article.authorId,
        //         senderName: user.username,
        //         type: NotificationType.COMMENT
        //     }

        //     await this.notificationRepository.createNotification(data);
        // }

        // await this.statisticalRepository.addStatistical(StatisticalType.COMMENT);
        // await this.articleRepository.update({ id: createCommentDto.articleId }, { commentCount: article.commentCount + 1 });

        // const commentInsert = await this.commentRepository.insert({ articleId: createCommentDto.articleId, userId: userId, content: createCommentDto.content });

        // return await this.commentRepository.getCommentById(commentInsert.identifiers[0].id);
    }

    async repComment(createReplyCommentDto: CreateReplyCommentDto, userId: number) {
        // const { parentId } = createReplyCommentDto;
        // const comment = await this.getCommentById(parentId);
        // const article = await this.getArticleById(comment.articleId);
        // const user = await this.userRepository.getUserInfo(userId);

        // createReplyCommentDto.articleId = comment.articleId;

        // const data = {
        //     article: article,
        //     receiverId: null,
        //     senderName: user.username,
        //     type: null,
        // }

        // if (article.authorId != userId) {
        //     data.receiverId = article.authorId
        //     data.type = NotificationType.COMMENT
        //     await this.notificationRepository.createNotification(data);
        // }

        // if (userId != comment.userId) {
        //     data.receiverId = comment.userId
        //     data.type = NotificationType.REP_COMMENT
        //     await this.notificationRepository.createNotification(data);
        // }

        // await this.statisticalRepository.addStatistical(StatisticalType.REP_COMMENT);
        // await this.articleRepository.update({ id: article.id }, { commentCount: article.commentCount + 1 });

        // const repCommentInsert = await this.commentRepository.insert({ articleId: createReplyCommentDto.articleId, userId: userId, content: createReplyCommentDto.content, parentId: createReplyCommentDto.parentId });

        // return await this.commentRepository.getCommentById(repCommentInsert.identifiers[0].id);
    }

    async deleteComment(id: number, req: Request) {
        // const comment = await this.getCommentById(id);
        // const article = await this.getArticleById(comment.articleId);

        // if (comment.userId !== req['user'].id && req['user'].role !== RoleScope.ADMIN) {
        //     throw new httpBadRequest("YOU_NOT_AUTHOR_COMMENT");
        // }

        // await this.statisticalRepository.addStatistical(StatisticalType.DELETE_COMMENT);

        // const commentDelete = await this.commentRepository.update(id, { deleted: true });

        // await this.articleRepository.update({ id: article.id }, { commentCount: article.commentCount - 1 });

        // return commentDelete;
    }

    async getListComment(query: ListCommentDto) {
        await this.getArticleById(query.articleId)

        return this.commentRepository.listComment(query);
    }

    async getListSubComment(query: ListSubCommentDto) {
        await this.checkExistedComment(query.parentId);

        return this.commentRepository.listSubComment(query);
    }

    async likeComment(commentUserLikesDto: CommentUserLikesDto) {
        // const { commentId, userId } = commentUserLikesDto;
        // const [comment, user, liked] = await Promise.all([
        //     this.getCommentById(commentId),
        //     this.userRepository.findOneBy({ id: userId }),
        //     this.commentRepository.checkLiked({ commentId, userId }),
        // ]);

        // const article = await this.getArticleById(comment.articleId);

        // const query = this.commentRepository
        //     .createQueryBuilder()
        //     .relation(Comment, 'likes')
        //     .of(comment);

        // if (liked) {
        //     await query.remove(user);
        //     await this.statisticalRepository.addStatistical(StatisticalType.UNLIKE_COMMENT);
        // } else {
        //     await query.add(user);

        //     if (comment.userId != userId) {
        //         const data = {
        //             article: article,
        //             receiverId: comment.userId,
        //             senderName: user.username,
        //             type: NotificationType.LIKE_COMMENT,
        //         }
        //         await this.notificationRepository.createNotification(data);
        //     }

        //     await this.statisticalRepository.addStatistical(StatisticalType.LIKE_COMMENT);
        // }

        // return true;
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

    async getArticleById(id: number) {
        // const article = await this.articleRepository.findOneBy({ id, deleted: false, isPublic: true });

        // if (!article) {
        //     throw new httpNotFound("ARTICLE_NOT_EXISTS");
        // }

        // return article;
    }
}
