import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    if (!headers['authorization']) {
      return res
        .status(400)
        .json({ message: 'Es necesaria la cabecera autorization' });
    }

    next();
  }
}
