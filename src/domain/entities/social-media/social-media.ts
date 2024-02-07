export class SocialMedia {
  private static readonly socialMediaNames: string [] = [
    'facebook', 'instagram', 'twitter', 'reddit'
  ]

  static getSocialMedias (): string[] {
    return this.socialMediaNames
  }
}