import Project from '#modules/project/models/project.js'
import { createdResponse, okResponse, resourceResponse } from '../../../app/utils/http_response.js'
import ProjectResource from '#modules/project/transformers/project_resource.js'
import { inject } from '@adonisjs/core'
import ProjectValidator, { ProjectDTO } from '#modules/project/validators/project_validator.js'
import db from '@adonisjs/lucid/services/db'
import MediaService from '#modules/media/services/media_service.js'
import { request } from '../../../app/utils/request_helper.js'

export default class AdminProjectsController {
    public async index() {
        const projects = await Project.query().latest('priority').preload('image').exec()

        return resourceResponse(await ProjectResource.collection(projects))
    }

    @inject()
    public async store(_: any, projectValidator: ProjectValidator) {
        const data: ProjectDTO = await projectValidator.validated()

        await db.transaction(async (trx) => {
            const project = await Project.create(data, { client: trx })
            await new MediaService({
                model: project,
                trx,
                data,
            }).storeOneMediaFromRequest()
        })

        return createdResponse()
    }

    @inject()
    public async update(_: any, projectValidator: ProjectValidator) {
        const item = await Project.findOrFail(request.param('id'))
        const data: ProjectDTO = await projectValidator.validated()
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
        const item = await Project.findOrFail(request.param('id'))
        await item.delete()

        return okResponse()
    }
}
