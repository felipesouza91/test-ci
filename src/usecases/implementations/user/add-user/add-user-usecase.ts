import type { AddUserData, AddUserResponse, AddUser } from '@/domain/contracts/user'
import type { AddUserRepo, FindUserByEmailRepo } from '@/usecases/contracts/db/user'
import type { IdBuilder } from '@/usecases/contracts/id'
import { EmailInUseError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class AddUserUseCase implements AddUser {
  constructor (
    private readonly findUserByEmailRepo: FindUserByEmailRepo,
    private readonly idBuilder: IdBuilder,
    private readonly addUserRepo: AddUserRepo
  ) {}

  async perform (data: AddUserData): Promise<AddUserResponse> {
    const userOrNull = await this.findUserByEmailRepo.execute(data.email)
    if (userOrNull) {
      return left(new EmailInUseError(data.email))
    }
    const id = this.idBuilder.build()
    await this.addUserRepo.execute({ id, ...data })
    return right(null)
  }
}
