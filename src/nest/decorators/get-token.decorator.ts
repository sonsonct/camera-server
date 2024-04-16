import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BasicAuth, TokenPayloadModel } from '../common/auth/basic-auth';


export const GetTokenDecorator = createParamDecorator(
    (dataChoice: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        // if route is protected, there is a user set in auth.middleware
        if (!!req.user) {
            return req.user as TokenPayloadModel;
        }

        // in case a route is not protected, we still want to get the optional auth user from jwt
        // const token = req.headers['authorization'];
        if (req.headers && req.headers['authorization']) {
            const headerAuthorization = req.headers['authorization'].split(' ');
            const decoded = BasicAuth.verifyToken(headerAuthorization[1]);
            return !decoded ? undefined : (decoded as TokenPayloadModel);
        }
    },
);

export const GetWorkflowPermissionsDecorator = createParamDecorator(
    (dataChoice: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        if (req.workflowPermissions) {
            return req.workflowPermissions as string[];
        }
        return [];
    },
);
