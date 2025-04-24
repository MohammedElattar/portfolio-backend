import User from '#models/user'

export default class AccessTokenService {
    public static async generate(user: User) {
        return await User.accessTokens.create(user)
    }
}
