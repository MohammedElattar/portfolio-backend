import BaseResource from '../../../app/resources/resource.js'
import Company from '#modules/company/models/company.js'

export default class CompanyResource extends BaseResource {
    async toObject(model: Company): Promise<unknown> {
        return {
            id: model.id,
            name: this.whenHas('name'),
        }
    }
}
