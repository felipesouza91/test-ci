import { type RpgStyleModel } from '@/domain/models'
import { FindManyRpgStylesPrismaRepo } from './find-many-rpg-styles-prisma-repo'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../../helpers/prisma-helper'
import { type PrismaClient } from '@prisma/client'

let prismock: PrismaClient

const makeFakeRpgStyleModel = (): RpgStyleModel => ({
  id: 'any_rpg_style_id',
  name: 'any_rpg_style_name'
})

const makeSut = (): FindManyRpgStylesPrismaRepo => {
  return new FindManyRpgStylesPrismaRepo()
}

describe('FindManyRpgStylesPrismaRepo', () => {
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

  it('Should return a list of rpg styles when has rpg styles', async () => {
    const sut = makeSut()
    await prismock.rpgStyle.create({ data: makeFakeRpgStyleModel() })
    const rpgStyles = await sut.execute()

    expect(rpgStyles).toEqual([makeFakeRpgStyleModel()])
  })
})
