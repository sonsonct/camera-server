import { CommentService } from '../comment.service';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto, CreateReplyCommentDto } from '../dto/create-comment.dto';
import { CommentUserLikesDto } from '../dto/create-likes-comment.dto';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
import { GetTokenDecorator } from 'src/nest/decorators/get-token.decorator';
import { TokenPayloadModel } from 'src/nest/common/auth/basic-auth';


@ApiTags("comments-user")
@ApplyAuthGuard()
@Controller('user/comments')
export class CommentUserController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @ApiResponse({
        description: 'Create comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create comment' })
    @ApiBody({ type: CreateCommentDto })
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @GetTokenDecorator() user: TokenPayloadModel,
    ) {
        return await this.commentService.createComment(createCommentDto, user.id);
    }

    @ApiResponse({
        description: 'Create rep comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create rep comment' })
    @ApiBody({ type: CreateReplyCommentDto })
    @Post('reply')
    @HttpCode(HttpStatus.OK)
    async replyComment(
        @Body() createReplyCommentDto: CreateReplyCommentDto,
        @GetTokenDecorator() user: TokenPayloadModel,
    ) {
        return await this.commentService.repComment(createReplyCommentDto, user.id);
    }

    @ApiResponse({
        description: 'Delete comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Delete comment' })
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteComment(
        @Param("id") id: number,
        @Request() req
    ) {
        return await this.commentService.deleteComment(id, req);
    }

    @ApiResponse({
        description: 'Like comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Like comment' })
    @Post('/like/:id')
    @HttpCode(HttpStatus.OK)
    async likeComment(
        @Param('id') id: number,
        @Request() req
    ) {
        const commentUserLikesDto = new CommentUserLikesDto;
        commentUserLikesDto.commentId = id;
        commentUserLikesDto.userId = +req.user.id;

        return await this.commentService.likeComment(commentUserLikesDto);
    }
}
