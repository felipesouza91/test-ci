import { FindUserByEmailPrismaRepo } from '@/infra/database/prisma/data/user/find-user-by-email/find-user-by-email-prisma-repo'
import { type FindUserByEmailRepo } from '@/usecases/contracts/db/user'

export const makeFindUserByEmailPrismaRepo = (): FindUserByEmailRepo => {
  return new FindUserByEmailPrismaRepo()
}
