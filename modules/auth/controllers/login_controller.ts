import { inject } from '@adonisjs/core'
import LoginService from '../services/login_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { LoginDTO, loginValidator } from '../validators/login_validator.js'
import { okResponse } from '../../../app/utils/http_response.js'
import UserResource from '../transformers/user_resource.js'

@inject()
export default class LoginController {
    constructor(private readonly loginService: LoginService) {}

    async mobile({ request }: HttpContext) {
        const data: LoginDTO = await request.validateUsing(loginValidator)
        const user = await this.loginService.mobile(data)

        return okResponse({ data: await UserResource.make(user) })
    }

    async dashboard({ request }: HttpContext) {
        const data: LoginDTO = await request.validateUsing(loginValidator)
        const user = await this.loginService.dashboard(data)

        okResponse({ data: await UserResource.make(user) })
    }
}
