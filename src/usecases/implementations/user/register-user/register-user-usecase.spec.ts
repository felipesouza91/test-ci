import { type RegisterUserData } from '@/domain/entities/user'
import { User } from '@/domain/entities/user/user'
import { type UserSocialMediaModel } from '@/domain/models'
import { left, right } from '@/shared/either'
import type { RegisterUserRepo } from '@/usecases/contracts/db/user'
import type { SaveUserSocialMediaRepo } from '@/usecases/contracts/db/user-social-media'
import { RegisterUserUseCase } from './register-user-usecase'

jest.mock('@/domain/entities/user/user', () => ({
  User: {
    register: jest.fn((data: RegisterUserData) => {
      const { dateOfBirth, ...otherData } = data
      return right({
        ...otherData,
        dateOfBirth: new Date('2000-12-31T00:00:00')
      })
    })
  }
}))

const makeFakeRegisterUserData = (): RegisterUserData => ({
  id: 'any_id',
  name: 'John Doe',
  username: 'john-doe',
  pronoun: 'he/his',
  dateOfBirth: '12-31-2000'
})

const makeRegisterUserRepo = (): RegisterUserRepo => {
  class RegisterUserRepoStub implements RegisterUserRepo {
    async execute (user: User): Promise<void> {
      await Promise.resolve()
    }
  }
  return new RegisterUserRepoStub()
}

const makeSaveUserSocialMediaRepo = (): SaveUserSocialMediaRepo => {
  class SaveUserSocialMediaRepoStub implements SaveUserSocialMediaRepo {
    async execute (data: UserSocialMediaModel): Promise<void> {
      await Promise.resolve()
    }
  }
  return new SaveUserSocialMediaRepoStub()
}

type SutTypes = {
  sut: RegisterUserUseCase
  registerUserRepoStub: RegisterUserRepo
  saveUserSocialMediaRepoStub: SaveUserSocialMediaRepo
}

const makeSut = (): SutTypes => {
  const saveUserSocialMediaRepoStub = makeSaveUserSocialMediaRepo()
  const registerUserRepoStub = makeRegisterUserRepo()
  const sut = new RegisterUserUseCase(registerUserRepoStub, saveUserSocialMediaRepoStub)
  return { sut, registerUserRepoStub, saveUserSocialMediaRepoStub }
}

describe('RegisterUserUseCase', () => {
  it('Should call User.register() with correct values', async () => {
    const { sut } = makeSut()
    const registerSpy = jest.spyOn(User, 'register')
    await sut.perform(makeFakeRegisterUserData())
    expect(registerSpy).toHaveBeenCalledWith(makeFakeRegisterUserData())
  })

  it('Should return the same Error if User.register() returns an Error', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'register').mockReturnValueOnce(
      left(new Error('any_error'))
    )
    const result = await sut.perform(makeFakeRegisterUserData())
    expect(result.value).toEqual(new Error('any_error'))
  })

  it('Should call RegisterUserRepo with correct values', async () => {
    const { sut, registerUserRepoStub } = makeSut()
    const executeSpy = jest.spyOn(registerUserRepoStub, 'execute')
    await sut.perform(makeFakeRegisterUserData())
    expect(executeSpy).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'John Doe',
      username: 'john-doe',
      pronoun: 'he/his',
      dateOfBirth: new Date('2000-12-31T00:00:00')
    })
  })

  it('Should throw if RegisterUserRepo throws', async () => {
    const { sut, registerUserRepoStub } = makeSut()
    jest.spyOn(registerUserRepoStub, 'execute').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeRegisterUserData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return right result on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeRegisterUserData())
    expect(result.isRight()).toBe(true)
  })

  it('Should return right result on success with social medias in data', async () => {
    const { sut, saveUserSocialMediaRepoStub } = makeSut()
    const executeSpy = jest.spyOn(saveUserSocialMediaRepoStub, 'execute')
    const result = await sut.perform({ ...makeFakeRegisterUserData(), socialMedias: [{ socialMediaId: 'any_id', userLink: 'any_link' }] })

    expect(executeSpy).toHaveBeenCalledWith({
      userId: 'any_id',
      socialMediaId: 'any_id',
      link: 'any_link'
    })
    expect(result.isRight()).toBe(true)
  })
})