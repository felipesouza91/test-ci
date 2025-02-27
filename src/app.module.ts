import { Module } from '@nestjs/common'
import { CityStateRoutesModule } from './routes/city-state/city-state-routes.module'
import { PlayerProfileRoutesModule } from './routes/player-profile/player-profile-routes.module'
import { RpgStyleRoutesModule } from './routes/rpg-style/rpg-style-routes.module'
import { SocialMediaRoutesModule } from './routes/social-media/social-media-routes.module'
import { UserPreferenceRoutesModule } from './routes/user-preference/user-preference-routes.module'
import { UserSocialMediaRoutesModule } from './routes/user-social-media/user-social-media-routes.module'
import { UserRoutesModule } from './routes/user/user-routes.module'

@Module({
  imports: [
    UserRoutesModule,
    SocialMediaRoutesModule,
    UserSocialMediaRoutesModule,
    UserPreferenceRoutesModule,
    RpgStyleRoutesModule,
    CityStateRoutesModule,
    PlayerProfileRoutesModule
  ]
})
export class AppModule {}
