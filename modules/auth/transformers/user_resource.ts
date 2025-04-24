import User from '#models/user'
import BaseResource from '../../../app/resources/resource.js'
import MediaHelper from '#modules/media/utils/media_util.js'

export default class UserResource extends BaseResource {
    async toObject(model: User): Promise<unknown> {
        return {
            id: model.id,
            name: this.whenHas('name'),
            email: this.whenHas('email'),
            type: this.whenHas('type'),
            avatar: this.whenNotNull(await MediaHelper.getMediaUrl(model, 'avatar')),
            token: this.whenHas('accessToken', () => {
                if (model.accessToken) {
                    return model.accessToken.value!.release()
                }

                return ''
            }),
        }
    }
}
