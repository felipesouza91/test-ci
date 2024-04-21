import type { Validation } from '@/presentation/contracts'
import type { Either } from '@/shared/either'
import { ZodHelper } from '@/validators/helpers/zod-helper'
import { z } from 'zod'

export class SignUpZodValidation implements Validation {
  validate (input: any): Either<Error, void> {
    const schema = z.object({
      externalAuthUserId: z.string(),
      name: z.string().min(3).max(30),
      email: z.string().email()
    })
    return ZodHelper.check({ value: input, schema })
  }
}
