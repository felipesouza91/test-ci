import { FindManyRpgStylesPrismaRepo } from '@/infra/db/prisma/data/rpg-style/find-many-rpg-styles/find-many-rpg-styles-prisma-repo'

export const makeFindManyRpgStylesPrismaRepo = (): FindManyRpgStylesPrismaRepo => {
  return new FindManyRpgStylesPrismaRepo()
}
