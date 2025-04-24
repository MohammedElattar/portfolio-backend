import { HttpContext } from '@adonisjs/core/http'
import { RegisterDTO, registerValidator } from '#modules/auth/validators/register_validator.js'
import VendorRegisterAction from '#modules/auth/actions/vendor_register_action.js'
import { inject } from '@adonisjs/core'

@inject()
export default class RegistersController {
    constructor(private readonly vendorRegisterAction: VendorRegisterAction) {}
    async vendor({ request }: HttpContext) {
        const data: RegisterDTO = await request.validateUsing(registerValidator)
        const result = await this.vendorRegisterAction.handle(data)
        return result
    }
}
