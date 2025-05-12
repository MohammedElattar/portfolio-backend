import Validator from '../../../app/utils/validator.js'
import {
    createSchemaObject,
    dateRules,
    foreignKeyRules,
    integerRules,
    longTextRules,
    stringRules,
} from '../../../app/utils/validation_rule_helper.js'
import { isUpdate } from '../../../app/utils/general.js'

export default class ExperienceValidator extends Validator {
    public static get schema() {
        const inUpdate = isUpdate(/.*experiences$/)

        return createSchemaObject({
            title: stringRules().conditionalSometimes(inUpdate),
            startDate: inUpdate ? dateRules().optional() : dateRules,
            endDate: inUpdate ? dateRules().afterField('startDate').nullable().optional() : dateRules().afterField('startDate').nullable(),
            description: longTextRules().conditionalSometimes(inUpdate),
            companyId: foreignKeyRules().conditionalSometimes(inUpdate),
            priority: integerRules().conditionalSometimes(inUpdate),
        })
    }
}

export type ExperienceDTO = Record<string, any>
