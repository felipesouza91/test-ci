import { adaptRoute } from '@/main/factories/adapters'
import { makeSaveUserPreferenceDayPeriodController } from '@/main/factories/controllers/user-preference-day-period/save-user-preference-day-period-controller-factory'
import { makeSaveUserPreferenceGamePlaceController } from '@/main/factories/controllers/user-preference-game-place/save-user-preference-game-place-controller-factory'
import { makeUpdateUserController } from '@/main/factories/controllers/user/update-user-controller-factory'
import { Controller, Patch, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('/user')
export class UserRoutes {
  @Patch()
  async updateUser (@Req() req: Request, @Res() res: Response): Promise<void> {
    const adaptNest = adaptRoute(makeUpdateUserController())
    await adaptNest.adapt(req, res)
  }

  @Post('/preference/day-period')
  async addDayPeriod (@Req() req: Request, @Res() res: Response): Promise<void> {
    const adaptNest = adaptRoute(makeSaveUserPreferenceDayPeriodController())
    await adaptNest.adapt(req, res)
  }

  @Post('/preference/game-place')
  async addGamePlace (@Req() req: Request, @Res() res: Response): Promise<void> {
    const adaptNest = adaptRoute(makeSaveUserPreferenceGamePlaceController())
    await adaptNest.adapt(req, res)
  }
}
