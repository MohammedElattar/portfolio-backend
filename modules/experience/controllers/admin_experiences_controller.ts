import Experience from '#modules/experience/models/experience.js'
import { createdResponse, okResponse, resourceResponse } from '../../../app/utils/http_response.js'
import ExperienceResource from '#modules/experience/transformers/experience_resource.js'
import { inject } from '@adonisjs/core'
import ExperienceValidator, {
    ExperienceDTO,
} from '#modules/experience/validators/experience_validator.js'
import { request } from '../../../app/utils/request_helper.js'

export default class AdminExperiencesController {
    public async index() {
        const experiences = await Experience.query().latest('priority').preload('company').exec()

        return resourceResponse(await ExperienceResource.collection(experiences))
    }

    @inject()
    public async store(_: any, experienceValidator: ExperienceValidator) {
        const data: ExperienceDTO = await experienceValidator.validated()

        await Experience.create(data)

        return createdResponse()
    }

    @inject()
    public async update(_: any, experienceValidator: ExperienceValidator) {
        const data: ExperienceDTO = await experienceValidator.validated()
        const item = await Experience.query().findOrFail(request.param('id'))

        await item.update(data)

        return okResponse()
    }

    public async destroy() {
        const item = await Experience.query().findOrFail(request.param('id'))
        await item.delete()

        return okResponse()
    }
}
