import BaseResource from '../../../app/resources/resource.js'
import Skill from '#modules/skill/models/skill.js'
import MediaHelper from '#modules/media/utils/media_util.js'

export default class SkillResource extends BaseResource {
    async toObject(model: Skill): Promise<unknown> {
        return {
            id: model.id,
            name: this.whenHas('name'),
            priority: this.whenHas('priority'),
            image: this.whenNotNull(await MediaHelper.getMediaUrl(model, 'image')),
        }
    }
}
