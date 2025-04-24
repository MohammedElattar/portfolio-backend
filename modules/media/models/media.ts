import { afterDelete, BaseModel, column, computed, scope } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import drive from '@adonisjs/drive/services/main'
import * as drive_1 from '#config/drive'
import { asset } from '../../../app/utils/general.js'
import CustomModel from '#models/utils/custom_model'
import { getMorphableTypeValue } from '../../../app/utils/morph.js'

export default class Media extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare modelId: number

    @column()
    declare modelType: string

    @column()
    declare name: string

    @column()
    declare fileName: string

    @column()
    declare path: string

    @column()
    declare size: number

    @column()
    declare disk: drive_1.DriveDiskType

    @column()
    declare collectionName: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    private _cachedUrl?: string

    @computed()
    get url() {
        if (this._cachedUrl) {
            return Promise.resolve(this._cachedUrl)
        }

        return drive
            .use(this.disk)
            .getUrl(this.path)
            .then((url) => {
                this._cachedUrl = asset(url)
                return this._cachedUrl
            })
    }

    @afterDelete()
    static async deleteMedia(media: Media) {
        await drive.use(media.disk).delete(media.path)
    }

    static whereType = scope((query, model: CustomModel) => {
        return query
            .where('model_type', getMorphableTypeValue(model.constructor as typeof CustomModel))
            .where('model_id', model.$primaryKeyValue as number)
    })
}
