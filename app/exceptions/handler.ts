import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import {
    errorResponse,
    notFoundResponse,
    validationErrorsResponse,
} from '../utils/http_response.js'
import { Exception } from '@adonisjs/core/exceptions'
import { translateWord } from '../utils/translator.js'
import ValidationErrorsException from '#exceptions/validation_errors_exception'

export default class HttpExceptionHandler extends ExceptionHandler {
    protected debug = !app.inProduction

    async handle(error: Exception, _ctx: HttpContext) {
        let message = error.message

        if (error instanceof errors.E_VALIDATION_ERROR) {
            return validationErrorsResponse(error.messages)
        }

        if (error instanceof ValidationErrorsException) {
            return validationErrorsResponse(error.getErrors())
        }

        if (error.code === 'E_ROUTE_NOT_FOUND') {
            return notFoundResponse({
                message: 'The requested route was not found',
            })
        }

        if (error.code === 'E_ROW_NOT_FOUND') {
            return notFoundResponse({
                message: 'Could not find the requested resource',
            })
        }

        if (error.code === 'E_UNAUTHORIZED_ACCESS') {
            message = translateWord('not_authenticated')
        }

        return errorResponse(null, message, error.status, error.code)
    }

    async report(error: unknown, ctx: HttpContext) {
        return super.report(error, ctx)
    }
}
