import { type UserPreferenceDayPeriodModel } from '@/models'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { type SaveUserPreferenceDayPeriodRepo } from '@/usecases/contracts/db/user-preference-day-period'

export class SaveUserPreferenceDayPeriodPrismaRepo implements SaveUserPreferenceDayPeriodRepo {
  async execute (data: UserPreferenceDayPeriodModel): Promise<void> {
    const { id, morning, afternoon, night } = data
    const prisma = await PrismaHelper.getPrisma()
    await prisma.userPreferenceDayPeriod.upsert({
      where: { id },
      update: { morning, afternoon, night },
      create: data
    })
  }
}
