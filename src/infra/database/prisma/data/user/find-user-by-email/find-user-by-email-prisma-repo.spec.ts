import { Prisma, type PrismaClient } from '@/infra/database/prisma/client'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { type UserModel } from '@/models'
import MockDate from 'mockdate'
import { createPrismock } from 'prismock'
import { FindUserByEmailPrismaRepo } from './find-user-by-email-prisma-repo'

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  email: 'any_email@mail.com',
  name: 'John Doe',
  dateOfBirth: new Date()
})

const PrismockClient = createPrismock(Prisma)

let prismock: PrismaClient

const makeSut = (): FindUserByEmailPrismaRepo => {
  return new FindUserByEmailPrismaRepo()
}

describe('FindUserByEmailPrismaRepo', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getPrisma').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.user.deleteMany()
  })

  afterAll(async () => {
    MockDate.reset()
    await prismock.$disconnect()
  })

  it('Should return an User if prisma findUnique() is a success', async () => {
    const sut = makeSut()
    await prismock.user.create({ data: makeFakeUserModel() })
    const user = await sut.execute('any_email@mail.com')
    expect(user).toEqual({
      ...makeFakeUserModel(),
      addressId: null,
      pronoun: "I don't want to share any pronouns",
      username: null,
      playerProfileId: null,
      title: null,
      bio: null,
      cityStateId: null
    })
  })

  it('Should return null if prisma findUnique() not found an User', async () => {
    const sut = makeSut()
    const user = await sut.execute('invalid_email@mail.com')
    expect(user).toBe(null)
  })

  it('Should throw if Prisma throws', async () => {
    const sut = makeSut()
    jest.spyOn(prismock.user, 'findUnique').mockRejectedValue(
      new Error('any_error_message')
    )
    const promise = sut.execute('invalid_email@mail.com')
    await expect(promise).rejects.toThrow(new Error('any_error_message'))
  })
})
