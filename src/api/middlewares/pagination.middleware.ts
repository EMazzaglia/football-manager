import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Middleware({ type: "after" })
export class PaginationMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    const originalJson = res.json;
    
    res.json = function(body: any): any {
      if (!body || typeof body !== 'object') {
        return originalJson.call(this, body);
      }
      
      // Handle mongoose-paginate-v2 results (which have items and total)
      if (body && body.items && body.total !== undefined) {
        const page = parseInt(String(req.query.page)) || 1;
        const limit = parseInt(String(req.query.limit)) || 10;
        const totalPages = Math.ceil(body.totalItems / limit);
        
        const paginatedResponse = {
          items: body.items,
          page: body.page || page,
          limit: body.limit || limit,
          totalItems: body.totalItems || body.total,
          totalPages: body.totalPages || totalPages
        };
        
        return originalJson.call(this, paginatedResponse);
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  }
}