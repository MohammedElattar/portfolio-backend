import { Exception } from '@adonisjs/core/exceptions'
import HttpStatus from '../../../app/enums/http_status.js'

export default class LoginException extends Exception {
    public static wrongCredentials() {
        return new this('Wrong credentials', {
            status: HttpStatus.UNAUTHORIZED,
            code: 'E_LOGIN',
        })
    }

    public static notVerified() {
        return new this('User is not verified', {
            status: HttpStatus.FORBIDDEN,
            code: 'E_LOGIN_NOT_VERIFIED',
        })
    }

    public static frozenAccount() {
        return new this('User account is frozen', {
            status: HttpStatus.FORBIDDEN,
            code: 'E_LOGIN_NOT_FROZEN',
        })
    }
}
