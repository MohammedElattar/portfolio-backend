import CustomModel from '#models/utils/custom_model'
import MediaService from '#modules/media/services/media_service.js'
import { DEFAULT_MEDIA } from '#modules/media/constants/index.js'
import { isset, storagePath } from '../../../app/utils/general.js'
import FileUploaderController from '#modules/media/controllers/file_uploader_controller.js'
import { existsSync } from 'node:fs'
import MediaException from '#modules/media/exceptions/media_exception.js'
import Media from '#modules/media/models/media.js'
import { defaultDriveDisk } from '#config/drive'
import { getMorphableTypeValue } from '../../../app/utils/morph.js'
import path from 'path'
import { getFileSize } from '../../../app/utils/storage.js'
import drive from '@adonisjs/drive/services/main'
import ValidationErrorsException from '#exceptions/validation_errors_exception'
import { translateWord } from '../../../app/utils/translator.js'

export default class LiveMediaService<Model extends CustomModel> extends MediaService<Model> {
    async storeOneMediaFromRequest(
        collection: string = DEFAULT_MEDIA,
        requestFileName: string = 'image'
    ) {
        if (isset(this.data[requestFileName])) {
            await this.storeOneMedia(this.data[requestFileName], collection, requestFileName)
        }
    }

    protected async storeOneMedia(
        tmpFilePath: string,
        collection: string,
        requestKey: string = ''
    ) {
        const fullPath = storagePath(FileUploaderController.generateTempFilePath(tmpFilePath))

        if (!existsSync(fullPath)) {
            if (requestKey !== '') {
                throw new ValidationErrorsException({
                    errors: { [requestKey]: translateWord('request_file_not_exists') },
                })
            }

            throw MediaException.fileNotExists()
        }

        const fileName = path.basename(fullPath)
        const media = await Media.create(
            {
                fileName,
                name: fileName,
                collectionName: collection || DEFAULT_MEDIA,
                size: await getFileSize(fullPath),
                disk: defaultDriveDisk,
                modelType: getMorphableTypeValue(this.model.constructor as typeof CustomModel),
                modelId: this.model.$primaryKeyValue as number,
                path: '_',
            },
            { client: this.trx }
        )

        const filePath: string = `uploads/${media.id}/${tmpFilePath}`

        await drive.use().move(FileUploaderController.generateTempFilePath(tmpFilePath), filePath, {
            visibility: 'public',
        })

        if (this.trx) {
            media.useTransaction(this.trx)
        }

        media.path = filePath
        return await media.save()
    }
}
