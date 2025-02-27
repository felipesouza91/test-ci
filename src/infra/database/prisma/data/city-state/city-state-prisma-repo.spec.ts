import { type CityStateProps } from '@/entities/user/value-objects/city-state/city-state'
import { Prisma, type PrismaClient } from '@/infra/database/prisma/client'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { UuidAdapter } from '@/infra/uuid-adapter/uuid-adapter'
import { createPrismock } from 'prismock'
import { CityStatePrismaRepo } from './city-state-prisma-repo'

const PrismockClient = createPrismock(Prisma)

let prismock: PrismaClient

const makeFakeCityStateModel = (): CityStateProps => ({
  uf: 'BA',
  city: 'Salvador',
  lifeInBrazil: true
})

const makeSut = (): CityStatePrismaRepo => {
  const idBuilder = new UuidAdapter()
  return new CityStatePrismaRepo(idBuilder)
}

describe('AddPlayerProfilePrismaRepo', () => {
  beforeAll(async () => {
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getPrisma').mockReturnValue(Promise.resolve(prismock))
  })

  beforeEach(async () => {
    await prismock.playerProfile.deleteMany()
  })

  afterAll(async () => {
    await prismock.$disconnect()
  })

  it('Should create a city state if prisma upsert() is a success', async () => {
    const sut = makeSut()
    const { id, ...cityStateReturn } = await sut.execute(makeFakeCityStateModel())
    const { city, uf } = makeFakeCityStateModel()
    const cityStateInDB = await prismock.cityState.findUnique({ where: { city_uf: { city: city ?? '', uf: uf ?? '' } }, select: { city: true, uf: true, lifeInBrazil: true } })
    expect(cityStateInDB).toEqual(makeFakeCityStateModel())
    expect(cityStateReturn).toEqual(makeFakeCityStateModel())
  })

  it('Should update a city state if data exists', async () => {
    const sut = makeSut()
    await sut.execute(makeFakeCityStateModel())
    const cityState = await prismock.cityState.findMany({ select: { city: true, uf: true, lifeInBrazil: true } })
    expect(cityState).toEqual([makeFakeCityStateModel()])
  })

  it('Should throw if prisma throws', async () => {
    const sut = makeSut()
    jest.spyOn(prismock.cityState, 'upsert').mockRejectedValue(
      new Error('any_error_message')
    )
    const promise = sut.execute(makeFakeCityStateModel())
    await expect(promise).rejects.toThrow(new Error('any_error_message'))
  })
})
