import { Prisma, type PrismaClient } from '@/infra/database/prisma/client'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import type { UserModel, UserPreferenceModel } from '@/models'
import MockDate from 'mockdate'
import { AddUserPreferencePrismaRepo } from './add-user-preference-prisma-repo'

import { createPrismock } from 'prismock'

const PrismockClient = createPrismock(Prisma)

let prismock: PrismaClient

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  email: 'any_email@mail.com',
  name: 'John Doe',
  dateOfBirth: new Date()
})

const makeFakeUserPreferenceModel = (): UserPreferenceModel => ({
  id: 'any_user_id',
  frequency: 'daily',
  activeType: 'player'
})

const makeSut = (): AddUserPreferencePrismaRepo => {
  return new AddUserPreferencePrismaRepo()
}

describe('AddUserPreferencePrismaRepo', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getPrisma').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.userPreference.deleteMany()
    await prismock.user.deleteMany()
  })

  afterAll(async () => {
    MockDate.reset()
    await prismock.$disconnect()
  })

  it('Should create a preference if prisma create() is a success', async () => {
    const sut = makeSut()
    await prismock.user.create({ data: makeFakeUserModel() })
    await sut.execute(makeFakeUserPreferenceModel())
    const preference = await prismock.userPreference.findUnique({ where: { id: 'any_user_id' } })
    expect(preference).toEqual(makeFakeUserPreferenceModel())
  })

  it('Should throw if Prisma throws', async () => {
    const sut = makeSut()
    jest.spyOn(prismock.userPreference, 'create').mockRejectedValue(new Error('any_error_message'))
    const promise = sut.execute(makeFakeUserPreferenceModel())
    await expect(promise).rejects.toThrow(new Error('any_error_message'))
  })
})
