import type { RegisterUserData, UserEntityErrors } from '@/entities/user/user-types'
import { type Either } from '@/shared/either'

export type RegisterUserResponse = Either<UserEntityErrors, void>

export interface RegisterUser {
  perform: (data: RegisterUserData, session?: any) => Promise<RegisterUserResponse>
}
