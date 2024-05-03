import { type CheckUsername } from '@/domain/contracts/user/check-username'
import { FindUserByUsernamePrismaRepo } from '@/infra/db/prisma/data/user/find-user-by-username/find-user-by-username-prisma-repo'
import { CheckUsernameUseCase } from '@/usecases/implementations/user/check-username/check-username-use-case'

export const makeCheckUsernameUseCase = (): CheckUsername => {
  const findUserByUsernamePrismaRepository = new FindUserByUsernamePrismaRepo()
  return new CheckUsernameUseCase(findUserByUsernamePrismaRepository)
}