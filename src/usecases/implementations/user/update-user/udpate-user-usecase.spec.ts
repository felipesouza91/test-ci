import { type UpdateUserData } from '@/domain/contracts/user'
import { UpdateUserUseCase } from './udpate-user-usecase'
import { formatDateStringToDateTime } from '@/util'
import type { UpdateUserRepo, UpdateUserRepoData } from '@/usecases/contracts/db/user'
import { left, right } from '@/shared/either'
import { User } from '@/domain/entities/user/user'
import { type UpdateUserEntityData } from '@/domain/entities/user'

jest.mock('@/util/format-date-string-to-date-time/format-date-string-to-date-time', () => ({
  ...jest.requireActual('@/util/format-date-string-to-date-time/format-date-string-to-date-time'),
  formatDateStringToDateTime: jest.fn().mockReturnValue(
    new Date('2000-12-31T00:00:00')
  )
}))

jest.mock('@/domain/entities/user/user', () => ({
  User: {
    update: jest.fn((data: UpdateUserEntityData) => {
      return right(data)
    })
  }
}))

const makeFakeUpdateUserData = (): UpdateUserData => ({
  id: 'any_user_id',
  firstName: 'any_first_name',
  lastName: 'any_last_name',
  phone: 'any_phone',
  dateOfBirth: '12-31-2000',
  nickname: 'any_nickname'
})

const makeFakeUpdateUserRepoData = (): UpdateUserRepoData => ({
  id: 'any_user_id',
  firstName: 'any_first_name',
  lastName: 'any_last_name',
  phone: 'any_phone',
  dateOfBirth: new Date('2000-12-31T00:00:00'),
  nickname: 'any_nickname'
})

const makeUpdateUserRepo = (): UpdateUserRepo => {
  class UpdateUserRepoStub implements UpdateUserRepo {
    async execute (data: UpdateUserRepoData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new UpdateUserRepoStub()
}

type SutTypes = {
  sut: UpdateUserUseCase
  updateUserRepoStub: UpdateUserRepo
}

const makeSut = (): SutTypes => {
  const updateUserRepoStub = makeUpdateUserRepo()
  const sut = new UpdateUserUseCase(updateUserRepoStub)
  return { sut, updateUserRepoStub }
}

describe('UpdateUserUseCase', () => {
  it('Should call User with correct values', async () => {
    const { sut } = makeSut()
    const updateSpy = jest.spyOn(User, 'update')
    await sut.perform(makeFakeUpdateUserData())
    const { id, nickname, ...data } = makeFakeUpdateUserData()
    expect(updateSpy).toHaveBeenCalledWith(data)
  })

  it('Should call User only with the data sent', async () => {
    const { sut } = makeSut()
    const updateSpy = jest.spyOn(User, 'update')
    const { phone, firstName, ...data } = makeFakeUpdateUserData()
    await sut.perform(data)
    expect(updateSpy).toHaveBeenCalledWith({
      dateOfBirth: '12-31-2000',
      lastName: 'any_last_name'
    })
  })

  it('Should call User with correct values if nickname not provided', async () => {
    const { sut } = makeSut()
    const updateSpy = jest.spyOn(User, 'update')
    const { nickname, ...data } = makeFakeUpdateUserData()
    await sut.perform(data)
    const { id, ...dataWithoutId } = data
    expect(updateSpy).toHaveBeenCalledWith(dataWithoutId)
  })

  it('Should return an error if User returns any error', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'update').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const result = await sut.perform(makeFakeUpdateUserData())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should throw if User throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'update').mockImplementationOnce(() => {
      throw new Error('any_message')
    })
    const promise = sut.perform(makeFakeUpdateUserData())
    await expect(promise).rejects.toThrow(new Error('any_message'))
  })

  it('Should call formatDateStringToDateTime() with dateOfBirth', async () => {
    const { sut } = makeSut()
    await sut.perform(makeFakeUpdateUserData())
    expect(formatDateStringToDateTime).toHaveBeenCalledWith('12-31-2000')
  })

  it('Should not call formatDateStringToDateTime() if dateOfBirth not provided', async () => {
    const { sut } = makeSut()
    const { dateOfBirth, ...data } = makeFakeUpdateUserData()
    await sut.perform(data)
    expect(formatDateStringToDateTime).not.toHaveBeenCalled()
  })

  it('Should throw if formatDateStringToDateTime() throws', async () => {
    const { sut } = makeSut()
    const formatMock = formatDateStringToDateTime as jest.MockedFunction<any>
    formatMock.mockImplementationOnce(() => {
      throw new Error('any_message')
    })
    const promise = sut.perform(makeFakeUpdateUserData())
    await expect(promise).rejects.toThrow(new Error('any_message'))
  })

  it('Should call UpdateUserRepo with correct values', async () => {
    const { sut, updateUserRepoStub } = makeSut()
    const executeSpy = jest.spyOn(updateUserRepoStub, 'execute')
    await sut.perform(makeFakeUpdateUserData())
    expect(executeSpy).toHaveBeenCalledWith(makeFakeUpdateUserRepoData())
  })

  it('Should call UpdateUserRepo without the dateOfBirth if this not provided', async () => {
    const { sut, updateUserRepoStub } = makeSut()
    const executeSpy = jest.spyOn(updateUserRepoStub, 'execute')
    const { dateOfBirth, ...data } = makeFakeUpdateUserData()
    await sut.perform(data)
    const { dateOfBirth: date, ...dataRepo } = makeFakeUpdateUserRepoData()
    expect(executeSpy).toHaveBeenCalledWith(dataRepo)
  })

  it('Should throw if UpdateUserRepo throws', async () => {
    const { sut, updateUserRepoStub } = makeSut()
    jest.spyOn(updateUserRepoStub, 'execute').mockReturnValueOnce(
      Promise.reject(new Error('any_message'))
    )
    const promise = sut.perform(makeFakeUpdateUserData())
    await expect(promise).rejects.toThrow(new Error('any_message'))
  })

  it('Should return right result on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeUpdateUserData())
    expect(result.isRight()).toBe(true)
  })
})