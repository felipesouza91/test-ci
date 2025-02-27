import { type CheckUsername } from '@/contracts/user/check-username'
import { type UserModel } from '@/models'
import { type FindUserByUsernameRepo } from '@/usecases/contracts/db/user/find-user-by-username-repo'
import { CheckUsernameUseCase } from './check-username-use-case'

type MakeSut = {
  sut: CheckUsername
  findUserByUsernameRepo: FindUserByUsernameRepo
}

class FindUserByUsernameRepoStub implements FindUserByUsernameRepo {
  async execute (username: string): Promise<UserModel | null> {
    return null
  }
}

const makeSut = (): MakeSut => {
  const findUserByUsernameRepo = new FindUserByUsernameRepoStub()
  const sut = new CheckUsernameUseCase(findUserByUsernameRepo)
  return {
    sut,
    findUserByUsernameRepo
  }
}

describe('CheckUsernameUseCase', () => {
  it('should throw if username already exits', async () => {
    const { sut, findUserByUsernameRepo } = makeSut()
    jest.spyOn(findUserByUsernameRepo, 'execute').mockResolvedValueOnce({
      email: 'valid_email@email.com',
      id: 'valid_id',
      name: 'Jonh Doe',
      username: 'exists_username'
    })
    const response = await sut.perform('exists_username')
    expect(response.isLeft()).toBe(true)
  })

  it('should return throw if FindUserByUsernameRepo throws ', async () => {
    const { sut, findUserByUsernameRepo } = makeSut()
    jest.spyOn(findUserByUsernameRepo, 'execute').mockRejectedValueOnce(new Error())
    const response = sut.perform('exists_username')
    await expect(response).rejects.toThrow()
  })

  it('should call repository with correct data', async () => {
    const { sut, findUserByUsernameRepo } = makeSut()
    const repositorySpy = jest.spyOn(findUserByUsernameRepo, 'execute')
    await sut.perform('exists_username')
    expect(repositorySpy).toHaveBeenCalledWith('exists_username')
  })

  it('should return void if username is available', async () => {
    const { sut } = makeSut()
    const response = await sut.perform('valid_username')
    expect(response.isRight()).toBe(true)
  })
})
