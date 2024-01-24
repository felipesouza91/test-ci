import { type FindPreferenceByIdRepo, type UpdateUserPreferenceRepo } from '@/usecases/contracts/db/user'
import { UpdateUserPreferenceUseCase } from './update-user-preference-usecase'
import { type UpdateUserPreferenceData } from '@/domain/contracts/user'
import { type PreferenceModel } from '@/domain/models'
import { NonExistentUserPreferenceError } from '@/domain/errors'

const makeFakePreferenceModel = (): PreferenceModel => ({
  id: 'any_user_id',
  frequency: 'daily',
  activeType: 'gameMaster'
})

const makeFakeUpdateUserPreferenceData = (): UpdateUserPreferenceData => ({
  id: 'any_user_id',
  frequency: 'daily'
})

const makeFindPreferenceByIdRepo = (): FindPreferenceByIdRepo => {
  class FindPreferenceByIdRepoStub implements FindPreferenceByIdRepo {
    async execute (id: string): Promise<PreferenceModel | null> {
      return await Promise.resolve(makeFakePreferenceModel())
    }
  }

  return new FindPreferenceByIdRepoStub()
}

const makeUpdateUserPreferenceRepo = (): UpdateUserPreferenceRepo => {
  class UpdateUserPreferenceRepoStub implements UpdateUserPreferenceRepo {
    async execute (data: UpdateUserPreferenceData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new UpdateUserPreferenceRepoStub()
}

type SutTypes = {
  sut: UpdateUserPreferenceUseCase
  updateUserPreferenceRepoStub: UpdateUserPreferenceRepo
  findPreferenceByIdRepoStub: FindPreferenceByIdRepo
}

const makeSut = (): SutTypes => {
  const findPreferenceByIdRepoStub = makeFindPreferenceByIdRepo()
  const updateUserPreferenceRepoStub = makeUpdateUserPreferenceRepo()
  const sut = new UpdateUserPreferenceUseCase(findPreferenceByIdRepoStub, updateUserPreferenceRepoStub)
  return {
    sut,
    updateUserPreferenceRepoStub,
    findPreferenceByIdRepoStub
  }
}

describe('UpdateUserPreferenceUsecase', () => {
  it('Should call FindPreferenceByIdRepo with correct values', async () => {
    const { sut, findPreferenceByIdRepoStub } = makeSut()
    const executeSpy = jest.spyOn(findPreferenceByIdRepoStub, 'execute')
    await sut.perform(makeFakeUpdateUserPreferenceData())
    expect(executeSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should return NonExistentUserPreferencesError if FindPreferenceByIdRepo returns null', async () => {
    const { sut, findPreferenceByIdRepoStub } = makeSut()
    jest.spyOn(findPreferenceByIdRepoStub, 'execute').mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.perform(makeFakeUpdateUserPreferenceData())
    expect(result.value).toEqual(new NonExistentUserPreferenceError('any_user_id'))
  })

  it('Should call UpdateUserPreferenceRepo with correct values', async () => {
    const { sut, updateUserPreferenceRepoStub } = makeSut()
    const executeSpy = jest.spyOn(updateUserPreferenceRepoStub, 'execute')
    await sut.perform(makeFakeUpdateUserPreferenceData())
    expect(executeSpy).toHaveBeenCalledWith(makeFakeUpdateUserPreferenceData())
  })

  it('Should throw if UpdateUserPreferenceRepo throws', async () => {
    const { sut, updateUserPreferenceRepoStub } = makeSut()
    jest.spyOn(updateUserPreferenceRepoStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.perform(makeFakeUpdateUserPreferenceData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return right result on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeUpdateUserPreferenceData())
    expect(result.isRight()).toBe(true)
  })
})