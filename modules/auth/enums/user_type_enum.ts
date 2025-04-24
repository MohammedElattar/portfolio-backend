import UserContextHelper from '../utils/user_context_helper.js'
import { Authenticable } from '../types/auth_types.js'

export enum UserTypeEnum {
    ADMIN,
}

export const getUserType = (user?: Authenticable) => {
    user = user || UserContextHelper.user()

    return user.type
}

export const shouldVerifyUser = (user: Authenticable) => {
    return user.emailVerifiedAt === null
}

export const availableTypes = [UserTypeEnum.ADMIN]
export const mobileTypes = []
export const alphaTypes = {
    admin: UserTypeEnum.ADMIN,
}
