import { ListQueryDto2 } from "src/commons/dtos/list-query.dto";

export class ListAllCommentDto extends ListQueryDto2 {
}

export class ListCommentDto extends ListQueryDto2 {
    public productId: number;
}

export class ListSubCommentDto extends ListQueryDto2 {
    public parentId: number;
}
