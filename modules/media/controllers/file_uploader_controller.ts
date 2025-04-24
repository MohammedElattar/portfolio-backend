import ImageUploadValidator, {
    ImageValidatorDTO,
} from '#modules/media/validators/image_upload_validator.js'
import { inject } from '@adonisjs/core'
import { cuid } from '@adonisjs/core/helpers'
import { okResponse } from '../../../app/utils/http_response.js'

export default class FileUploaderController {
    @inject()
    async handle(_ctx: any, imageUploaderValidator: ImageUploadValidator) {
        const data: ImageValidatorDTO = await imageUploaderValidator.validated()
        const fileName = `${cuid()}.${data.source.extname}`
        const filePath = FileUploaderController.generateTempFilePath(fileName)

        await data.source.moveToDisk(filePath)

        return okResponse({
            data: {
                source: fileName,
            },
            message: 'File Uploaded Successfully',
        })
    }

    public static generateTempFilePath(path: string): string {
        return `private/${path}`
    }
}
