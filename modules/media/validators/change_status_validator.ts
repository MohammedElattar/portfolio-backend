import { InferInput } from '@vinejs/vine/types'
import { booleanRules, createSchemaObject } from '../../../app/utils/validation_rule_helper.js'
import Validator from '../../../app/utils/validator.js'

export default class ChangeStatusValidator extends Validator {
    public static override get schema() {
        return createSchemaObject({
            status: booleanRules(),
        })
    }
}

export type ChangeStatusValidatorDTO = InferInput<typeof ChangeStatusValidator.schema>
