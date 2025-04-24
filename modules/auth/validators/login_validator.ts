import { InferInput } from '@vinejs/vine/types'
import {
    createSchemaObject,
    createValidator,
    emailRules,
    stringRules,
} from '../../../app/utils/validation_rule_helper.js'

const schema = createSchemaObject({
    email: emailRules(),
    password: stringRules(),
})

export const loginValidator = createValidator(schema)
export type LoginDTO = InferInput<typeof schema>
