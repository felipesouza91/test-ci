import type { Validation } from '@/contracts'
import { type Either } from '@/shared/either'
import { ZodHelper } from '@/helpers/zod/zod-helper'
import { z } from 'zod'

export class RegisterUserZodValidation implements Validation {
  validate (input: any): Either<Error, void> {
    const schema = z.object({
      name: z.string().min(3).max(30),
      username: z.string().min(1).max(15),
      pronoun: z.string(),
      dateOfBirth: z.string().min(10).max(10),
      playerProfileId: z.string(),
      rpgStyles: z.array(z.string()).min(1).max(3),
      socialMedias: z.array(z.object({
        socialMediaId: z.string(),
        userLink: z.string()
      })).optional(),
      title: z.string().min(3).max(100).optional(),
      bio: z.string().min(3).max(500).optional(),
      cityState: z.object({
        uf: z.string().length(2).optional(),
        city: z.string().optional(),
        lifeInBrazil: z.boolean()
      }).optional()
    })
    return ZodHelper.check({ value: input, schema })
  }
}
