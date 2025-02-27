import { type UserPreferenceModel } from '@/models'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { type AddUserPreferenceRepo } from '@/usecases/contracts/db/user-preference'

export class AddUserPreferencePrismaRepo implements AddUserPreferenceRepo {
  async execute (data: UserPreferenceModel): Promise<void> {
    const prisma = await PrismaHelper.getPrisma()
    await prisma.userPreference.create({ data })
  }
}
