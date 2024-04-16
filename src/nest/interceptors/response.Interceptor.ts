import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseCodeEnum } from 'src/commons/enums';
import { ResponseBuilder } from 'src/utils/response-builder';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                const responseBuilder = new ResponseBuilder(data)
                    .withCode(ResponseCodeEnum.SUCCESS)
                    .build();
                return responseBuilder;
            }),
        );
    }
}
