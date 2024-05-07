import type { UserModel } from '@/domain/models'
import { PrismaHelper } from '@/infra/db/prisma/helpers'
import type { PrismaClient } from '@prisma/client'
import MockDate from 'mockdate'
import { PrismockClient } from 'prismock'
import { AddUserPrismaRepo } from './add-user-prisma-repo'

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  email: 'any_email@mail.com',
  name: 'John Doe',
  dateOfBirth: new Date()
})

let prismock: PrismaClient

const makeSut = (): AddUserPrismaRepo => {
  return new AddUserPrismaRepo()
}

describe('AddUserPrismaRepo', () => {
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

  it('Should create a User if prisma create() is a success', async () => {
    const sut = makeSut()
    await sut.execute(makeFakeUserModel())
    const user = await prismock.user.findUnique({ where: { id: 'any_user_id' } })
    expect(user).toEqual({
      ...makeFakeUserModel(),
      addressId: null,
      pronoun: null,
      username: null,
      playerProfileId: null,
      title: null,
      bio: null
    })
  })

  it('Should throw if Prisma throws', async () => {
    const sut = makeSut()
    jest.spyOn(prismock.user, 'create').mockRejectedValue(
      new Error('any_error_message')
    )
    const promise = sut.execute(makeFakeUserModel())
    await expect(promise).rejects.toThrow(new Error('any_error_message'))
  })
})
