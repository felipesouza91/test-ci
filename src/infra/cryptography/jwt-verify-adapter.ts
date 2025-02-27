import { type Decrypter } from '@/usecases/contracts/cryptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtVerifyAdapter implements Decrypter {
  constructor (private readonly secretKey: string) {}

  async execute (token: string): Promise<null | string> {
    try {
      const payload: any = jwt.verify(token, this.secretKey)
      if (!payload.clerkUserId) {
        return null
      }
      return payload.clerkUserId
    } catch (error: any) {
      const errors = ['JsonWebTokenError', 'NotBeforeError', 'TokenExpiredError', 'SyntaxError']
      for (const name of errors) {
        if (error.name === name) {
          return null
        }
      }
      throw new Error(error.message)
    }
  }
}
