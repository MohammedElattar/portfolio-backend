import Validator from '../../../app/utils/validator.js'
import {
    createSchemaObject,
    dateRules,
    foreignKeyRules,
    integerRules,
    longTextRules,
    stringRules,
} from '../../../app/utils/validation_rule_helper.js'

export default class ExperienceValidator extends Validator {
    public static get schema() {
        return createSchemaObject({
            title: stringRules(),
            startDate: dateRules(),
            endDate: dateRules().afterField('startDate').nullable(),
            description: longTextRules(),
            companyId: foreignKeyRules(),
            priority: integerRules(),
        })
    }
}

export type ExperienceDTO = Record<string, any>
