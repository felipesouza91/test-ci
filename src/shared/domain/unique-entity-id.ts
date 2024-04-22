import { UuidAdapter } from '@/infra/id/uuid-adapter/uuid-adapter'
import { ValueObject } from './value-object'

export class UniqueEntityId extends ValueObject<string> {
  /* eslint-disable */
  constructor (id?: string) {
    super(id ?? new UuidAdapter().build())
  }
}