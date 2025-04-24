import { errors } from '@vinejs/vine'
import { FieldContext, ErrorReporterContract } from '@vinejs/vine/types'

export class JSONAPIErrorReporter implements ErrorReporterContract {
    hasErrors: boolean = false

    errors: any[] = []
    errorsObject: Record<string, string> = {}

    report(message: string, _rule: string, field: FieldContext, _meta?: any) {
        this.hasErrors = true

        this.errorsObject[field.name] = message
    }

    createError() {
        return new errors.E_VALIDATION_ERROR(this.errorsObject)
    }
}
