import CustomModel from '#models/utils/custom_model'
import { asset } from '../../../app/utils/general.js'
import Media from '#modules/media/models/media.js'

export default class MediaHelper {
    public static async getMediaUrl<Model extends CustomModel>(
        model: Model,
        relation: string = 'image',
        defaultFileName = 'store.png',
        shouldReturnDefault: boolean = true
    ) {
        if (model.relationLoaded(relation)) {
            // @ts-ignore
            if (model[relation]) {
                // @ts-ignore
                return await model[relation].url
            }

            if (shouldReturnDefault) {
                return asset(`storage/uploads/default/${defaultFileName}`)
            }
        }

        return null
    }

    public static async getImagesObject<Model extends CustomModel>(
        model: Model,
        relation: string = 'otherImages'
    ) {
        if (model.relationLoaded(relation)) {
            return Promise.all(
                // @ts-ignore
                model[relation].map(async (media: Media) => ({
                    id: media.$primaryKeyValue,
                    url: await media.url,
                }))
            )
        }

        return null
    }
}
