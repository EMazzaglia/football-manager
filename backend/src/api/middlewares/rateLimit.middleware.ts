import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import rateLimit from "express-rate-limit";
import { Service } from "typedi";

@Middleware({ type: "before" })
@Service()
export class RateLimitMiddleware implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any): void | Promise<void> {
        // 100 request every 15 minutes.
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
            message: "Too many requests, please try again after 15 minutes"
        });

        return limiter(request, response, next);
    }
}