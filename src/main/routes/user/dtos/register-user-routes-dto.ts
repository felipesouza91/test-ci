import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserRoutesDto {
  @ApiProperty({ example: 'John Doe' })
    name: string

  @ApiProperty({
    example: '12-31-2000',
    description: 'Data de nascimento no formato: MM-DD-YYYY',
    format: 'MM-DD-YYYY'
  })
    dateOfBirth: string

  @ApiProperty({ example: 'john-doe' })
    username: string

  @ApiProperty({
    example: 'she/her',
    description: "Gênero do usuário ('he/his' | 'she/her' | 'they/theirs')"
  })
    pronoun: string

  constructor (name: string, username: string, dateOfBirth: string, pronoun: string) {
    this.name = name
    this.username = username
    this.dateOfBirth = dateOfBirth
    this.pronoun = pronoun
  }
}
