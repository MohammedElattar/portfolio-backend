import { Exception } from '@adonisjs/core/exceptions'
import HttpStatus from '../../../app/enums/http_status.js'

export default class SpatialFieldsNotDefinedException extends Exception {
    status = HttpStatus.INTERNAL_SERVER_ERROR
    code = 'SPATIAL_FIELD_ERROR'
}
