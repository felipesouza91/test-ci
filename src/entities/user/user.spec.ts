import { User } from './user'

describe('User Entity', () => {
  it('Should register an User on success', async () => {
    const result = User.register({
      id: 'any_id',
      name: 'John Doe',
      username: 'john-doe',
      pronoun: 'he/his',
      dateOfBirth: '12-31-2000',
      playerProfileId: '9228a9a0-c7e0-4d62-80bb-458dd772c4f9',
      rpgStyles: ['7e1e51a5-2c45-4d15-bf87-03202dfe4b7e'],
      socialMedias: [{ socialMediaId: '7e1e51a5-2c45-4d15-bf87-03202dfe4b7e', userLink: 'any_link' }],
      title: 'any_title',
      bio: 'any_bio',
      cityState: {
        city: 'any_city',
        uf: 'uf',
        lifeInBrazil: true
      }
    })

    const user = result.value as User
    expect(user.id).toBe('any_id')
    expect(user.name).toBe('John Doe')
    expect(user.username).toBe('john-doe')
    expect(user.pronoun).toBe('he/his')
    expect(user.dateOfBirth).toEqual(new Date('2000-12-31T00:00:00.000Z'))
    expect(user.playerProfile).toBe('9228a9a0-c7e0-4d62-80bb-458dd772c4f9')
    expect(user.rpgStyles).toEqual(['7e1e51a5-2c45-4d15-bf87-03202dfe4b7e'])
    expect(user.socialMedias?.[0]).toEqual({ socialMediaId: '7e1e51a5-2c45-4d15-bf87-03202dfe4b7e', userLink: 'any_link' })
    expect(user.title).toBe('any_title')
    expect(user.bio).toBe('any_bio')
    expect(user.cityState).toEqual({ city: 'any_city', uf: 'uf', lifeInBrazil: true })
  })
})
