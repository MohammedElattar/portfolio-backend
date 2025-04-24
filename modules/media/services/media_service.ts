import CustomModel from '#models/utils/custom_model'
import RequestHelper from '../../../app/utils/request_helper.js'
import MediaException from '#modules/media/exceptions/media_exception.js'
import { cuid } from '@adonisjs/core/helpers'
import Media from '#modules/media/models/media.js'
import { DEFAULT_MEDIA } from '#modules/media/constants/index.js'
import { defaultDriveDisk } from '#config/drive'
import { sep } from 'node:path'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { getMorphableTypeValue } from '../../../app/utils/morph.js'
import { isset } from '../../../app/utils/general.js'
import { safePromiseAll } from '../../../app/utils/safe_promise.js'

export default class MediaService<Model extends CustomModel> {
    protected readonly model: Model
    protected readonly trx?: TransactionClientContract
    protected readonly data: Record<string, any>

    constructor(args: {
        model: Model
        trx?: TransactionClientContract
        data?: Record<string, any>
    }) {
        this.model = args.model
        this.trx = args.trx
        this.data = args.data ?? []
    }

    async storeOneMediaFromRequest(
        collection: string = DEFAULT_MEDIA,
        requestFileName: string = 'image'
    ) {
        const file = RequestHelper.get().allFiles()[requestFileName]

        await this.storeOneMedia(file, collection)
    }

    public async updateOneMediaFromRequest(
        collection: string = DEFAULT_MEDIA,
        requestFileName: string = 'image'
    ) {
        if (isset(this.data[requestFileName])) {
            await this.deleteOneMedia(collection)
            await this.storeOneMediaFromRequest(collection, requestFileName)
        }
    }

    public async deleteOneMedia(collection: string = DEFAULT_MEDIA) {
        const media = await Media.query({ client: this.trx })
            .withScopes((scopes) => scopes.whereType(this.model))
            .where('collectionName', collection)
            .first()

        if (media) {
            await media.delete()
        }
    }

    async storeMultipleMediaFromRequest(collection: string, requestKey: string) {
        if (isset(this.data[requestKey])) {
            const files = this.data[requestKey]

            await safePromiseAll(files, (file) => this.storeOneMedia(file, collection))
        }
    }

    async updateMultipleMediaFromRequest(
        collection: string,
        deleteMediaRequestKey: string,
        otherMediaRequestKey: string
    ) {
        await this.deleteMultipleMediaViaIds(deleteMediaRequestKey)
        await this.storeMultipleMediaFromRequest(collection, otherMediaRequestKey)
    }

    async deleteMultipleMediaViaIds(requestKey: string) {
        if (isset(this.data[requestKey])) {
            const models = await Media.query({ client: this.trx })
                .whereIn('id', this.data[requestKey])
                .exec()

            await Promise.all(
                models.map((model) => {
                    if (this.trx) {
                        model.useTransaction(this.trx)
                    }

                    return model.delete()
                })
            )
        }
    }

    protected async storeOneMedia(file: any, collection: string = DEFAULT_MEDIA) {
        if (file === null) {
            throw MediaException.fileNotExists()
        }

        let path = this.generatePath(file)
        let fullPath: any = path.split(sep)
        const fileName = fullPath[fullPath.length - 1]
        fullPath.pop()

        const mediaItem = await Media.create(
            {
                fileName,
                name: file.clientName,
                collectionName: collection || DEFAULT_MEDIA,
                size: file.size,
                disk: defaultDriveDisk,
                modelType: getMorphableTypeValue(this.model.constructor as typeof CustomModel),
                modelId: this.model.$primaryKeyValue as number,
                path: '_',
            },
            { client: this.trx }
        )

        path = path.replace(':mediaId', mediaItem.id + '')

        await file.moveToDisk(path)

        mediaItem.path = path
        await mediaItem.save()

        return mediaItem
    }

    private generatePath(file: any) {
        return `uploads${sep}:mediaId${sep}${cuid()}.${file.extname}`
    }
}
