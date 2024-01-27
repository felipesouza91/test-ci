/**
 * @jest-environment ./src/main/configs/db-test/custom-environment-jest.ts
 */

import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { type PrismaClient } from '@prisma/client'
import addRpgStyleSeed from './add-rpg-style-seed'

let prisma: PrismaClient

describe('addRpgStyleSeed', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getPrisma()
  })

  beforeEach(async () => {
    await prisma.rpgStyle.deleteMany()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  it('Should add all RpgStyles', async () => {
    await addRpgStyleSeed
    const rpgStyles = await prisma.rpgStyle.findMany()
    expect(rpgStyles.length).toBe(1)
  })
})