import type { SaveUserPreferenceGamePlace, SaveUserPreferenceGamePlaceData, SaveUserPreferenceGamePlaceResponse } from '@/contracts/user-preference-game-place'
import { type Validation } from '@/contracts'
import { badRequest, noContent, serverError } from '@/helpers/http/http-helpers'
import { type HttpRequest } from '@/types/http'
import { left, right, type Either } from '@/shared/either'
import { SaveUserPreferenceGamePlaceController } from './save-user-preference-game-place-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    userId: 'any_user_id'
  },
  body: {
    online: true,
    inPerson: false
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, void> {
      return right()
    }
  }
  return new ValidationStub()
}

const makeFakeSaveUserPreferenceGamePlace = (): SaveUserPreferenceGamePlace => {
  class SaveUserPreferenceGamePlaceStub implements SaveUserPreferenceGamePlace {
    async perform (data: SaveUserPreferenceGamePlaceData): Promise<SaveUserPreferenceGamePlaceResponse> {
      return await Promise.resolve(right())
    }
  }
  return new SaveUserPreferenceGamePlaceStub()
}

type SutTypes = {
  sut: SaveUserPreferenceGamePlaceController
  validationStub: Validation
  saveUserPreferenceGamePlaceStub: SaveUserPreferenceGamePlace
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const saveUserPreferenceGamePlaceStub = makeFakeSaveUserPreferenceGamePlace()
  const sut = new SaveUserPreferenceGamePlaceController(validationStub, saveUserPreferenceGamePlaceStub)
  return { sut, saveUserPreferenceGamePlaceStub, validationStub }
}

describe('SaveUserPreferenceGamePlaceController', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call SaveUserPreferenceGamePlace with correct values', async () => {
    const { sut, saveUserPreferenceGamePlaceStub } = makeSut()
    const performSpy = jest.spyOn(saveUserPreferenceGamePlaceStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      ...makeFakeRequest().body
    })
  })

  it('Should return 500 if SaveUserPreferenceGamePlace throws', async () => {
    const { sut, saveUserPreferenceGamePlaceStub } = makeSut()
    jest.spyOn(saveUserPreferenceGamePlaceStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
