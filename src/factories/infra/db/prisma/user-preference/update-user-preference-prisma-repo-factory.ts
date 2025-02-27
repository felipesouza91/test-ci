import { UpdateUserPreferencePrismaRepo } from '@/infra/database/prisma/data/user-preference/update-user-preference/update-user-preference-prisma-repo'
import { type UpdateUserPreferenceRepo } from '@/usecases/contracts/db/user-preference'

export const makeUpdateUserPreferencePrismaRepo = (): UpdateUserPreferenceRepo => {
  return new UpdateUserPreferencePrismaRepo()
}
