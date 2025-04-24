import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { getUserType, UserTypeEnum } from '#modules/auth/enums/user_type_enum.js'
import UserContextHelper from '#modules/auth/utils/user_context_helper.js'
import { forbiddenResponse } from '../../../app/utils/http_response.js'

export default class UserTypeMiddleware {
    async handle(_ctx: HttpContext, next: NextFn, types: UserTypeEnum[]) {
        if (await UserContextHelper.check()) {
            if (!types.includes(getUserType())) {
                return forbiddenResponse()
            }
        }
        return await next()
    }
}
