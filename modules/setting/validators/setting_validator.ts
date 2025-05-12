import Validator from '../../../app/utils/validator.js'
import {
    createSchemaObject,
    emailRules,
    stringRules,
    urlRules,
} from '../../../app/utils/validation_rule_helper.js'
import { Infer } from '@vinejs/vine/types'

export default class SettingValidator extends Validator {
    public static get schema() {
        return createSchemaObject({
            name: stringRules().optional(),
            headline: stringRules().optional(),
            whatsapp: stringRules().optional(),
            email: emailRules().optional(),
            github: urlRules().optional(),
            linkedin: urlRules().optional(),
            resumeUrl: urlRules().optional(),
        })
    }
}

export type SettingDTO = Infer<typeof SettingValidator.schema>
