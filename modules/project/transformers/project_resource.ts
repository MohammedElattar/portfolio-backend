import BaseResource from '../../../app/resources/resource.js'
import Project from '#modules/project/models/project.js'
import MediaHelper from '#modules/media/utils/media_util.js'

export default class ProjectResource extends BaseResource {
    async toObject(model: Project): Promise<unknown> {
        return {
            id: model.id,
            title: this.whenHas('title'),
            appStore: this.whenHas('appStore'),
            googlePlay: this.whenHas('googlePlay'),
            live: this.whenHas('live'),
            description: this.whenHas('description'),
            image: this.whenNotNull(await MediaHelper.getMediaUrl(model, 'image')),
            priority: this.whenHas('priority'),
        }
    }
}
