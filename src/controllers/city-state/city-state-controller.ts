import { type GetCityState } from '@/contracts/county-state/get-county-state'
import { type Validation } from '@/contracts'
import { type Controller } from '@/contracts/controller'
import { badRequest, ok, serverError } from '@/helpers/http/http-helpers'
import { type HttpRequest, type HttpResponse } from '@/types/http'

export class CityStateController implements Controller {
  constructor (private readonly getCityState: GetCityState, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }

      const { uf } = httpRequest.body

      const cityStateResult = await this.getCityState.perform(uf, httpRequest.session)
      if (cityStateResult.isLeft()) {
        return badRequest(cityStateResult.value)
      }
      return ok(cityStateResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
