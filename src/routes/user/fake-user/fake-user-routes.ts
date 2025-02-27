import { adaptRoute } from '@/factories/adapters'
import { makeAddFakeUserController } from '@/factories/controllers/user/add-fake-user-controller-factory'
import { Controller, Get, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

@ApiTags('Fake-User')
@Controller('/fake-user')
export class FakeUserRoutes {
  @Get('/generate-token')
  @ApiOperation({
    summary: 'Cria um usuário falso',
    description: 'Cria um novo usuário falso e retorna um token para acesso com uma hora de validade'
  })
  async addFakeUser (@Req() req: Request, @Res() res: Response): Promise<void> {
    const adaptNest = adaptRoute(makeAddFakeUserController())
    await adaptNest.adapt(req, res)
  }
}
