import Validator from '../../../app/utils/validator.js'
import {
    createSchemaObject,
    imageRules,
    integerRules,
    stringRules,
} from '../../../app/utils/validation_rule_helper.js'
import { isUpdate } from '../../../app/utils/general.js'
import { InferInput } from '@vinejs/vine/types'

export default class SkillValidator extends Validator {
    public static get schema() {
        const inUpdate = isUpdate(/.*skills$/)

        return createSchemaObject({
            name: stringRules().conditionalSometimes(inUpdate),
            priority: integerRules().conditionalSometimes(inUpdate),
            image: inUpdate
                ? imageRules({
                      extnames: ['svg', 'png'],
                  }).optional()
                : imageRules({
                      extnames: ['svg', 'png'],
                  }),
        })
    }
}

export type SkillDTO = InferInput<typeof SkillValidator.schema>
