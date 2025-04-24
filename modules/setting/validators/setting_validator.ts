import Validator from '../../../app/utils/validator.js'
import {
    createSchemaObject,
    emailRules,
    stringRules,
    urlRules,
} from '../../../app/utils/validation_rule_helper.js'
import { InferInput } from '@vinejs/vine/types'

export default class SettingValidator extends Validator {
    public static get schema() {
        return createSchemaObject({
            name: stringRules(),
            headline: stringRules(),
            whatsapp: stringRules(),
            email: emailRules(),
            github: urlRules(),
            linkedin: urlRules(),
            resumeUrl: urlRules(),
        })
    }
}

export type SettingDTO = InferInput<typeof SettingValidator.schema>
