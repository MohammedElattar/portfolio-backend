import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class AccessTokenResource {
    public static toObject(accessToken: AccessToken) {
        return {
            token: accessToken.value!.release(),
        }
    }
}
