import type { SaveUserPreferenceDayPeriod } from '@/contracts/user-preference-day-period'
import type { Controller, Validation } from '@/contracts'
import { badRequest, noContent, serverError } from '@/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/types/http'

export class SaveUserPreferenceDayPeriodController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly saveUserPreferenceDayPeriod: SaveUserPreferenceDayPeriod
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      await this.saveUserPreferenceDayPeriod.perform({
        userId: httpRequest.headers.userId,
        ...httpRequest.body
      })
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}