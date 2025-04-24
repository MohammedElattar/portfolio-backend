import BaseResource from '../../../app/resources/resource.js'
import Setting from '#modules/setting/models/setting.js'

export default class SettingResource extends BaseResource {
    async toObject(model: Setting): Promise<unknown> {
        return super.toObject(model)
    }
}
