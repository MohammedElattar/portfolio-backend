import { middleware } from '#start/kernel'
import { UserTypeEnum } from '#modules/auth/enums/user_type_enum.js'

export default class AuthMiddlewareHelper {
    public static authMiddleware() {
        return middleware.auth({
            guards: ['api'],
        })
    }

    public static defaultMiddlewares() {
        return [this.authMiddleware()]
    }

    public static adminMiddlewares() {
        return [...this.defaultMiddlewares(), middleware.userTypeIn([UserTypeEnum.ADMIN])]
    }

    public static encodeTypes(types: UserTypeEnum[] | UserTypeEnum) {
        let convertedTypes = ''

        if (Array.isArray(types)) {
            convertedTypes = types.join('|')
        } else {
            convertedTypes = types + ''
        }

        return convertedTypes
    }

    public static decodeTypes(encodedTypes: string) {
        return encodedTypes.split('|')
    }
}
