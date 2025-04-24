import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export type Authenticable = User & {
    currentAccessToken: AccessToken
}
