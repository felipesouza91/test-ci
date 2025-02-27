import type { Auth, AuthResponse } from '@/contracts/user'
import { AccessDeniedError, InvalidTokenError, AccessTokenNotInformedError } from '@/errors'
import { forbidden, ok, serverError, unauthorized } from '@/helpers/http/http-helpers'
import { type HttpRequest } from '@/types/http'
import { left, right } from '@/shared/either'
import { AuthMiddleware } from './auth-middleware'

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

const makeAuth = (): Auth => {
  class AuthStub implements Auth {
    async perform (token: string): Promise<AuthResponse> {
      return await Promise.resolve(right({ userId: 'any_id' }))
    }
  }
  return new AuthStub()
}

interface SutTypes {
  sut: AuthMiddleware
  authStub: Auth
}

const makeSut = (): SutTypes => {
  const authStub = makeAuth()
  const sut = new AuthMiddleware(authStub)
  return { sut, authStub }
}

describe('Auth Middleware', () => {
  it('Should return 401 if x-access-token not provided in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized(new AccessTokenNotInformedError()))
  })

  it('Should call Auth with correct values', async () => {
    const { sut, authStub } = makeSut()
    const performSpy = jest.spyOn(authStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return 401 if Auth return InvalidTokenError', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new InvalidTokenError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new InvalidTokenError()))
  })

  it('Should return 403 if Auth return AccessDeniedError', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new AccessDeniedError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 500 if Auth throws', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ userId: 'any_id' }))
  })
})
