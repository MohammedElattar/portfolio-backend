import { Exception } from '@adonisjs/core/exceptions'

type ErrorsType = Record<string, string> | Record<'errors', Record<string, string>>

export default class ValidationErrorsException extends Exception {
    errors: ErrorsType = {}
    status: number = 422
    code?: string | undefined = 'VALIDATION_ERRORS'

    constructor(errors: ErrorsType) {
        super()
        this.errors = errors
    }

    getErrors(): Record<string, string> {
        if (Object.hasOwn(this.errors, 'errors')) {
            return this.errors.errors as Record<string, string>
        }

        return this.errors as Record<string, string>
    }
}
