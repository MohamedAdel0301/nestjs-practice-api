import { UsersService } from './../users/users.service';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/users/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }
    next();
  }
}
