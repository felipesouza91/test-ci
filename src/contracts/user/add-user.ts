import type { EmailInUseError } from '@/errors'
import type { Either } from '@/shared/either'

export type AddUserData = {
  externalAuthUserId: string
  name: string
  email: string
}

export type AddUserResponse = Either<EmailInUseError, void>

export interface AddUser {
  perform: (data: AddUserData) => Promise<AddUserResponse>
}
