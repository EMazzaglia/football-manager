import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import rateLimit from "express-rate-limit";
import { Service } from "typedi";

@Middleware({ type: "before" })
@Service()
export class RateLimitMiddleware implements ExpressMiddlewareInterface {
    private limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests, please try again after 15 minutes"
    });

    use(request: any, response: any, next: (err?: any) => any): void | Promise<void> {
        return this.limiter(request, response, next);
    }
}