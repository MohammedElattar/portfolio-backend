import Setting from '#modules/setting/models/setting.js'
import { okResponse, resourceResponse } from '../../../app/utils/http_response.js'
import SettingResource from '#modules/setting/transformers/setting_resource.js'
import { inject } from '@adonisjs/core'
import SettingValidator, { SettingDTO } from '#modules/setting/validators/setting_validator.js'

export default class AdminSettingsController {
    public async show() {
        const setting = await Setting.firstOrFail()

        return resourceResponse(await SettingResource.make(setting))
    }

    @inject()
    public async update(_: any, settingValidator: SettingValidator) {
        const data: SettingDTO = await settingValidator.validated()
        const item = await Setting.firstOrFail()

        await item.update(data)

        return okResponse()
    }
}
