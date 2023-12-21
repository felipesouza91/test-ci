import { adaptMiddleware } from '@/main/factories/adapters'
import { makeAuthMiddleware } from '@/main/factories/middlewares'
import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

export class AuthNestMiddleware implements NestMiddleware {
  async use (req: Request, res: Response, next: NextFunction): Promise<void> {
    const adaptedMiddleware = adaptMiddleware(makeAuthMiddleware())
    await adaptedMiddleware.adapt(req, res, next)
  }
}
