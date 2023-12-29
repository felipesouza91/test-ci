import { Module } from '@nestjs/common'
import { SocialMediaModule } from './routes/social-media/social-media-route.module'
import { SignUpModule } from './routes/signup/signup.module'
import { UserModule } from './routes/user/user-route.module'

@Module({
  imports: [SignUpModule, SocialMediaModule, UserModule]
})
export class AppModule {}