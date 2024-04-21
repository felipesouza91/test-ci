import { type User } from '@/domain/entities/user'
import { PrismaHelper } from '@/infra/db/prisma/helpers'
import { type RegisterUserRepo } from '@/usecases/contracts/db/user'

export class RegisterUserPrismaRepo implements RegisterUserRepo {
  async execute (user: User): Promise<void> {
    const prisma = await PrismaHelper.getPrisma()
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        username: user.username,
        pronoun: user.pronoun,
        dateOfBirth: user.dateOfBirth
      }
    })
  }
}
