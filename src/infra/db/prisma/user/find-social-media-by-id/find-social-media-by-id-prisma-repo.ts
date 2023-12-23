import { type SocialMediaModel } from '@/domain/models/social-media/social-media-model'
import { type FindSocialMediaByIdRepo } from '@/usecases/contracts/db/social-media/find-social-media-by-id-repo'
import { PrismaHelper } from '../../helpers/prisma-helper'

export class FindSocialMediaByIdPrismaRepo implements FindSocialMediaByIdRepo {
  async execute (socialMediaId: string): Promise<null | SocialMediaModel> {
    const prisma = await PrismaHelper.getPrisma()
    const socialMediaOrNull = await prisma.socialMedia.findUnique({ where: { id: socialMediaId } })
    return socialMediaOrNull
  }
}
