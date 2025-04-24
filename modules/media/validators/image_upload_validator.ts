import { InferInput } from '@vinejs/vine/types'
import { createSchemaObject, imageRules } from '../../../app/utils/validation_rule_helper.js'
import Validator from '../../../app/utils/validator.js'

export default class ImageUploadValidator extends Validator {
    public static override get schema() {
        return createSchemaObject({
            source: imageRules(),
        })
    }
}
export type ImageValidatorDTO = InferInput<typeof ImageUploadValidator.schema>
