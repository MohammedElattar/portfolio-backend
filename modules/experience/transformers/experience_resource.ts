import BaseResource from '../../../app/resources/resource.js'
import Experience from '#modules/experience/models/experience.js'
import CompanyResource from '#modules/company/transformers/company_resource.js'

export default class ExperienceResource extends BaseResource {
    async toObject(model: Experience): Promise<unknown> {
        return {
            id: model.id,
            title: this.whenHas('title'),
            startDate: this.whenHas('startDate'),
            endDate: this.whenHas('endDate'),
            company: this.whenLoaded('company', async function () {
                return await CompanyResource.make(model.company)
            }),
            priority: this.whenHas('priority'),
            description: this.whenHas('description'),
        }
    }
}
