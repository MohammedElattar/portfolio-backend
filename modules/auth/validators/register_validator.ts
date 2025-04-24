import { InferInput } from '@vinejs/vine/types'
import {
    createSchemaObject,
    createValidator,
    emailRules,
    passwordRules,
    stringRules,
} from '../../../app/utils/validation_rule_helper.js'

/**
 * Validator to validate the payload when creating
 * a new register.
 */
const schema = createSchemaObject({
    name: stringRules(),
    email: emailRules(),
    password: passwordRules(),
})

export const registerValidator = createValidator(schema)
export type RegisterDTO = InferInput<typeof schema>
