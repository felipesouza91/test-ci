/**
 * @jest-environment ./src/infra/database/prisma/schema/custom-environment-jest.ts
 */

import { type SocialMediaModel } from '@/models'
import { PrismaHelper } from '@/infra/database/prisma/helpers'
import { AppModule } from '@/app.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { PrismaClient } from '@prisma/client'
import request from 'supertest'

const makeFakeSocialMediasModel = (): SocialMediaModel[] => ([{
  id: 'any_social_media_id_1',
  name: 'any_name_1',
  baseUri: 'any1.com/'
}, {
  id: 'any_social_media_id_2',
  name: 'any_name_2',
  baseUri: 'any2.com/'
}])

let prisma: PrismaClient
let app: INestApplication

describe('SocialMedia Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getPrisma()
  })

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = module.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  describe('GET /social-media', () => {
    it('Should return 200 when returns all social medias', async () => {
      await prisma.socialMedia.createMany({
        data: makeFakeSocialMediasModel()
      })
      await request(app.getHttpServer())
        .get('/social-media')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(
            makeFakeSocialMediasModel()
          )
        })
    })
  })
})
