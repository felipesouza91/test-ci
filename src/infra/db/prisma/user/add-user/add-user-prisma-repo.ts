import type { UserModel } from '@/domain/models'
import type { AddUserRepo } from '@/usecases/contracts/db/user'
import { PrismaHelper } from '../../helpers/prisma-helper'

export class AddUserPrismaRepo implements AddUserRepo {
  async execute (data: UserModel): Promise<void> {
    const prisma = await PrismaHelper.getPrisma()
    await prisma.user.create({ data })
  }
}
