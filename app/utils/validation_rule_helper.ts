import vine, { VineBoolean, VineNumber, VineString } from '@vinejs/vine'
import { DateFieldOptions, type EnumLike, FieldContext, SchemaTypes } from '@vinejs/vine/types'
import { FileRuleValidationOptions } from '@adonisjs/core/providers/vinejs_provider'

interface RuleOptions<T extends SchemaTypes> {
    [key: string]: null | ((schema: T) => T)
}

export const stringRules = createRules<VineString>(vine.string(), {
    maxLength: (schema) => schema.maxLength(255),
})

export const urlRules = (options: RuleOptions<VineString> = {}) => {
    return stringRules({
        ...options,
        url: (schema) => schema.url(),
    })
}

export const latitudeRules = (options: RuleOptions<VineNumber> = {}) => {
    return integerRules({
        withoutDecimal: null,
        range: (schema) => schema.range([-90, 90]),
        ...options,
    })
    // return stringRules({
    //   regex: schema => schema.regex(/^-?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/),
    //   maxLength: null,
    //   ...options,
    // })
}

export const longitudeRules = (options: RuleOptions<VineNumber> = {}) => {
    return integerRules({
        withoutDecimal: null,
        range: (schema) => schema.range([-180, 180]),
        ...options,
    })
    // return latitudeRules({
    //   regex: schema => schema.regex(/^-?(([0-9]?[0-9]|1[0-7][0-9])\.(\d+))|(180(\.0+)?)$/),
    //   ...options,
    // })
}

export const longTextRules = (options: RuleOptions<VineString> = {}) => {
    return stringRules({
        ...options,
        maxLength: null,
    })
}
export const doubleRules = createRules<VineNumber>(vine.number(), {
    min: (schema) => schema.min(1),
})
export const integerRules = createRules<VineNumber>(vine.number(), {
    min: (schema) => schema.min(1),
    withoutDecimal: (schema) => schema.withoutDecimals(),
})

export const foreignKeyRules = (options: RuleOptions<VineNumber> = {}) => {
    return integerRules(options)
}

export const hexColorRules = createRules<VineString>(vine.string(), {
    hexCode: (schema) => schema.hexCode(),
})

export const arrayRule = <T extends SchemaTypes>(schema: T) => {
    return vine.array(schema)
}

export const enumRules = (
    values: readonly unknown[] | ((field: FieldContext) => readonly unknown[])
) => {
    return vine.enum(values)
}

export const nativeEnumRules = <Values extends EnumLike>(values: Values) => {
    return vine.enum(values)
}

export const emailRules = (options: RuleOptions<VineString> = {}) => {
    return stringRules({
        ...options,
        email: (schema) => schema.email(),
    })
}

export const passwordRules = createRules<VineString>(vine.string(), {
    alphaNum: (schema) => schema.alphaNumeric(),
    confirmed: (schema) => schema.confirmed(),
    min: (schema) => schema.minLength(8),
})

export const booleanRules = createRules<VineBoolean>(vine.boolean())

export const dateRules = (options?: DateFieldOptions) => {
    return vine.date({
        formats: ['YYYY-MM-DD'],
        ...options,
    })
}
export const imageRules = (options?: FileRuleValidationOptions) => {
    return vine.file({
        size: '10mb',
        extnames: ['png', 'jpg', 'jpeg'],
        ...options,
    })
}

export const createSchemaObject = <T extends Record<string, SchemaTypes>>(schemaObject: T) => {
    return vine.object(schemaObject)
}

export const createValidator = (schemaObject: SchemaTypes) => {
    return vine.compile(schemaObject)
}

function createRules<T extends SchemaTypes>(baseSchema: T, defaultRules: RuleOptions<T> = {}) {
    return (options: RuleOptions<T> = {}): T => {
        let schema = baseSchema.clone()

        Object.entries({ ...defaultRules, ...options }).forEach(([key, rule]) => {
            if (typeof options[key] === 'function') {
                schema = options[key](schema)
            } else if (typeof options[key] === 'undefined' && typeof rule === 'function') {
                schema = rule(schema)
            }
        })

        return schema
    }
}
