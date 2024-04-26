import { type Either } from '@/shared/either'

import { type InvalidPlayerProfileIdError } from './errors/invalid-plyer-profile-id-error'

import type { InvalidDateOfBirthError, InvalidNameError, InvalidPronounError, InvalidRpgStyleError, InvalidUsernameError } from './errors'
import { type User } from './user'
import { type PronounEnum, type SocialMediaProps } from './value-objects'

export type RegisterUserData = {
  id: string
  name: string
  dateOfBirth: string
  username: string
  pronoun: PronounEnum
  playerProfileId: string
  rpgStyles: string[]
  socialMedias?: SocialMediaProps[]
  title?: string
  bio?: string
}

export type UserEntityErrors =
  InvalidDateOfBirthError |
  InvalidUsernameError |
  InvalidNameError |
  InvalidPronounError |
  InvalidPlayerProfileIdError |
  InvalidRpgStyleError

export type RegisterUserResponse = Either<UserEntityErrors, User>
