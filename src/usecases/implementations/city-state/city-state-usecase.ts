import { type CityStateResponse, type GetCityState } from '@/contracts/county-state/get-county-state'
import { CityStateError } from '@/errors'
import { left, right } from '@/shared/either'
import { type IBGEService } from '@/usecases/contracts/services/ibge/ibge-service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CityStateUsecase implements GetCityState {
  constructor (private readonly iBGEService: IBGEService) { }

  async perform (uf: string, session?: any): Promise<CityStateResponse> {
    const { cities } = await this.iBGEService.execute({ uf, city: '' })

    if (!cities.length) return left(new CityStateError())

    session.getCityValidationDone = true

    return right(cities)
  }
}
