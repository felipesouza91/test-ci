import type { SaveUserPreferenceDayPeriod } from '@/domain/contracts/user-preference-day-period'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/types/http'

export class SaveUserPreferenceDayPeriodController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly saveUserPreferenceDayPeriod: SaveUserPreferenceDayPeriod
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      await this.saveUserPreferenceDayPeriod.perform({
        userId: httpRequest.headers.userId,
        ...httpRequest.body
      })
      return noContent()
    } catch (error) {
      return serverError()
    }
  }
}