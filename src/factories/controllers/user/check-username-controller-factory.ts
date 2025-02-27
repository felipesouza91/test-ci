import { type Controller } from '@/contracts'
import { CheckUsernameController } from '@/controllers/user/check-username/check-username-controller'
import { BadWordValidation } from '@/validators/user/bad-work-validation/bad-word-validation'
import { CheckUsernameZodValidation } from '@/validators/user/check-username/check-username-zod-validation'
import { makeCheckUsernameUseCase } from '../../usecases/user/check-user-by-username-usecase-factory'

export const makeCheckUsernameController = (): Controller => {
  const usernameValidation = new CheckUsernameZodValidation()
  const badWordValidation = new BadWordValidation()
  const checkUsernameUseCase = makeCheckUsernameUseCase()
  return new CheckUsernameController([usernameValidation, badWordValidation], checkUsernameUseCase)
}
