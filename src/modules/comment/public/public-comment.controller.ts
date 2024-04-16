import { CommentService } from '../comment.service';
import { Controller, Get, HttpCode, HttpStatus, Param, Query, } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListCommentDto, ListSubCommentDto } from '../dto/find-comment.dto';

@ApiTags("comments-public")
@Controller('public/comments')
export class CommentPublicController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @ApiResponse({
        description: 'Get list comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List comment' })
    @Get('/:productId/')
    @HttpCode(HttpStatus.OK)
    async listComment(
        @Param('productId') productId: number,
        @Query() listCommentDto: ListCommentDto,
    ) {
        listCommentDto.productId = productId;
        return await this.commentService.getListComment(listCommentDto);
    }

    @ApiResponse({
        description: 'Get list sub comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List sub comment' })
    @Get('/reply/:parentId')
    @HttpCode(HttpStatus.OK)
    async listSubComment(
        @Param('parentId') parentId: number,
        @Query() listSubCommentDto: ListSubCommentDto,
    ) {
        listSubCommentDto.parentId = parentId;
        return await this.commentService.getListSubComment(listSubCommentDto);
    }

}
