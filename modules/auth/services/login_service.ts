import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import LoginException from '../exceptions/login_exception.js'
import { LoginDTO } from '../validators/login_validator.js'
import { AuthEnum } from '../enums/auth_enum.js'
import AccessTokenService from './access_token_service.js'

export default class LoginService {
    async mobile(data: LoginDTO) {
        return await this.login(data, true)
    }

    async dashboard(data: LoginDTO) {
        return await this.login(data, false)
    }

    private async login(data: LoginDTO, inMobile: boolean) {
        const user = await this.findUser(data, inMobile)

        await this.validateUser(data, user)

        return await this.processLogin(user as User)
    }

    private async findUser(data: LoginDTO, inMobile: boolean) {
        return await User.query()
            .withScopes((scopes) => scopes.validateLoginType(inMobile))
            .where('email', data.email)
            .preload('avatar')
            .select(['id', 'name', 'email', 'password', AuthEnum.VERIFIED_AT, 'status', 'type'])
            .first()
    }

    private async validateUser(data: LoginDTO, user: User | null) {
        if (!user) {
            throw LoginException.wrongCredentials()
        }

        await this.validateUserPassword(user.password, data.password)

        if (!user.emailVerifiedAt) {
            throw LoginException.notVerified()
        }

        if (!user.status) {
            throw LoginException.frozenAccount()
        }
    }

    private async processLogin(user: User) {
        user.accessToken = await AccessTokenService.generate(user)

        return user
    }

    private async validateUserPassword(hashedValue: string, actualValue: string) {
        const isValid = await hash.verify(hashedValue, actualValue)

        if (!isValid) {
            throw LoginException.wrongCredentials()
        }
    }
}
