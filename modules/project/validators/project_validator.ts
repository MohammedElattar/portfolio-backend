import Validator from '../../../app/utils/validator.js'
import {
    createSchemaObject,
    imageRules,
    integerRules,
    longTextRules,
    stringRules,
    urlRules,
} from '../../../app/utils/validation_rule_helper.js'
import { isUpdate } from '../../../app/utils/general.js'

export default class ProjectValidator extends Validator {
    public static get schema() {
        const inUpdate = isUpdate(/.*projects$/)

        return createSchemaObject({
            title: stringRules(),
            description: longTextRules(),
            priority: integerRules(),
            appStore: urlRules().nullable(),
            googlePlay: urlRules().nullable(),
            live: urlRules().nullable(),
            image: inUpdate ? imageRules().optional() : imageRules(),
        })
    }
}

export type ProjectDTO = Record<string, any>
