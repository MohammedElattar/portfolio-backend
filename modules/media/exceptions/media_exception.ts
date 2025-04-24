import { Exception } from '@adonisjs/core/exceptions'
import HttpStatus from '../../../app/enums/http_status.js'
import { translateWord } from '../../../app/utils/translator.js'

export default class MediaException extends Exception {
    code = 'MEDIA'

    public static fileNotExists() {
        return new this(translateWord('request_file_not_exists'), {
            status: HttpStatus.BAD_REQUEST,
        })
    }

    public static failedToMoveMedia() {
        return new this(translateWord('failed_to_move_media'), {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        })
    }
}
