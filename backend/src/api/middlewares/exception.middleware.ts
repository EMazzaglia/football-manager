import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class ExceptionHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: NextFunction): void {
        const status = error.status || error.httpCode || 500;
        const message = error.message || 'Something went wrong';

        response.status(status).json({
            status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            details: error.details || undefined
        });
    }
}