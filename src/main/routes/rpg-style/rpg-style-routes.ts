import { adaptRoute } from '@/main/factories/adapters'
import { makeFindManyRpgStylesController } from '@/main/factories/controllers/rpg-style/find-many-rpg-styles-controller-factory'
import { Controller, Get, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

@ApiTags('Rpg-Style')
@Controller('/rpg-style')
export class RpgStyleRoutes {
  @Get()
  async findManyRpgStyles (@Req() req: Request, @Res() res: Response): Promise<void> {
    const adaptNest = adaptRoute(makeFindManyRpgStylesController())
    await adaptNest.adapt(req, res)
  }
}
