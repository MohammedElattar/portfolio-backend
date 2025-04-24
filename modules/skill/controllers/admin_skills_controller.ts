import Skill from '#modules/skill/models/skill.js'
import { createdResponse, okResponse, resourceResponse } from '../../../app/utils/http_response.js'
import SkillResource from '#modules/skill/transformers/skill_resource.js'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import MediaService from '#modules/media/services/media_service.js'
import { request } from '../../../app/utils/request_helper.js'
import SkillValidator, { SkillDTO } from '#modules/skill/validators/skill_validator.js'

export default class AdminSkillsController {
    public async index() {
        const skills = await Skill.query().latest('priority').preload('image').exec()

        return resourceResponse(await SkillResource.collection(skills))
    }

    @inject()
    public async store(_: any, skillValidator: SkillValidator) {
        const data: SkillDTO = await skillValidator.validated()

        await db.transaction(async (trx) => {
            const skill = await Skill.create(data, { client: trx })
            await new MediaService({
                model: skill,
                trx,
                data,
            }).storeOneMediaFromRequest()
        })

        return createdResponse()
    }

    @inject()
    public async update(_: any, skillValidator: SkillValidator) {
        const item = await Skill.findOrFail(request.param('id'))
        const data: SkillDTO = await skillValidator.validated()

        await db.transaction(async (trx) => {
            await item.update(data, trx)
            await new MediaService({
                model: item,
                trx,
                data,
            }).updateOneMediaFromRequest()
        })

        return okResponse()
    }

    public async destroy() {
        const item = await Skill.findOrFail(request.param('id'))
        await item.delete()

        return okResponse()
    }
}
