import { type UserModel } from '@/models'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { type FindUserByUsernameRepo } from '@/usecases/contracts/db/user/find-user-by-username-repo'

export class FindUserByUsernamePrismaRepo implements FindUserByUsernameRepo {
  async execute (username: string): Promise<UserModel | null > {
    const prisma = await PrismaHelper.getPrisma()
    const userOrNull = await prisma.user.findFirst({ where: { username } })
    return userOrNull
  }
}
