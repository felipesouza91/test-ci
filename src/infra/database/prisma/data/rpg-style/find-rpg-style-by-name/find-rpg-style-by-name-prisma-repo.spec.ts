import { Prisma, type PrismaClient } from '@/infra/database/prisma/client'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { type RpgStyleModel } from '@/models'
import { FindRpgStyleByNamePrismaRepo } from './find-rpg-style-by-name-prisma-repo'

import { createPrismock } from 'prismock'
const PrismockClient = createPrismock(Prisma)

let prismock: PrismaClient

const makeFakeRpgStyleModel = (): RpgStyleModel => ({
  id: 'any_rpg_style_id',
  name: 'any_rpg_style_name'
})

const makeSut = (): FindRpgStyleByNamePrismaRepo => {
  return new FindRpgStyleByNamePrismaRepo()
}

describe('FindRpgStyleByNamePrismaRepo', () => {
  beforeAll(async () => {
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getPrisma').mockReturnValue(Promise.resolve(prismock))
  })
  beforeEach(async () => {
    await prismock.rpgStyle.deleteMany()
  })

  afterAll(async () => {
    await prismock.$disconnect()
  })

  it('Should return rpg style if prisma findFirst() is a success', async () => {
    const sut = makeSut()
    await prismock.rpgStyle.create({ data: makeFakeRpgStyleModel() })
    const rpgStyle = await sut.execute('any_rpg_style_name')
    expect(rpgStyle).toEqual(makeFakeRpgStyleModel())
  })

  it('Should return null if prisma findFirst() not found a rpg stype', async () => {
    const sut = makeSut()
    const rpgStyle = await sut.execute('invalid_rpg_style_name')
    expect(rpgStyle).toBe(null)
  })

  it('Should throw if Prisma throws', async () => {
    const sut = makeSut()
    jest.spyOn(prismock.rpgStyle, 'findFirst').mockRejectedValue(new Error('any_error_message'))
    const promise = sut.execute('any_rpg_style_name')
    await expect(promise).rejects.toThrow(new Error('any_error_message'))
  })
})
