import vine, { VineArray, VineBoolean, VineNumber, VineString } from '@vinejs/vine'
import RequestHelper from '../../../app/utils/request_helper.js'
import { isNumeric } from '../../../app/utils/general.js'
import { FieldContext, SchemaTypes } from '@vinejs/vine/types'

declare module '@vinejs/vine' {
    interface VineString {
        conditionalSometimes(inUpdate?: boolean): any
    }

    interface VineNumber {
        conditionalSometimes(inUpdate?: boolean): any

        lt(value: number | string): VineNumber

        gt(value: number | string): VineNumber

        gte(value: number | string): VineNumber

        lte(value: number | string): VineNumber
    }

    interface VineBoolean {
        conditionalSometimes(inUpdate?: boolean): any
    }
}

const lt = async (value: unknown, options: { comparedValue: number }, field: FieldContext) => {
    if (typeof value !== 'number') {
        return
    }

    if (!(value < options.comparedValue)) {
        field.report(`The {{ field }} must be less than ${options.comparedValue}`, 'lt', field)
    }
}

const lte = async (value: unknown, options: { comparedValue: number }, field: FieldContext) => {
    if (typeof value !== 'number') {
        return
    }

    if (!(value <= options.comparedValue)) {
        field.report(
            `The {{ field }} must be less than or equal ${options.comparedValue}`,
            'lte',
            field
        )
    }
}

const gt = async (value: unknown, options: { comparedValue: number }, field: FieldContext) => {
    if (typeof value !== 'number') {
        return
    }

    if (!(value > options.comparedValue)) {
        field.report(`The {{ field }} must be greater than ${options.comparedValue}`, 'gt', field)
    }
}

const gte = async (value: unknown, options: { comparedValue: number }, field: FieldContext) => {
    if (typeof value !== 'number') {
        return
    }

    if (!(value >= options.comparedValue)) {
        field.report(
            `The {{ field }} must be greater than or equal ${options.comparedValue}`,
            'gte',
            field
        )
    }
}
const ltRule = vine.createRule(lt)
const gtRule = vine.createRule(gt)
const lteRule = vine.createRule(lte)
const gteRule = vine.createRule(gte)

VineNumber.macro('lt', function (this: VineNumber, value: number | string) {
    value = getNumericValue(value)

    if (!isNumeric(value)) return this

    return this.use(ltRule({ comparedValue: value as number }))
})

VineNumber.macro('lte', function (this: VineNumber, value: number | string) {
    value = getNumericValue(value)

    if (!isNumeric(value)) return this

    return this.use(lteRule({ comparedValue: value as number }))
})

VineNumber.macro('gt', function (this: VineNumber, value: number | string) {
    value = getNumericValue(value)

    if (!isNumeric(value)) return this

    return this.use(gtRule({ comparedValue: value as number }))
})

VineNumber.macro('gte', function (this: VineNumber, value: number | string) {
    value = getNumericValue(value)

    if (!isNumeric(value)) return this

    return this.use(gteRule({ comparedValue: value as number }))
})

// @ts-ignore
VineString.macro('conditionalSometimes', function (this: VineString, inUpdate: boolean = false) {
    return inUpdate ? this.optional() : this
})
// @ts-ignore
VineNumber.macro('conditionalSometimes', function (this: VineNumber, inUpdate: boolean = false) {
    return inUpdate ? this.optional() : this
})
// @ts-ignore
VineBoolean.macro('conditionalSometimes', function (this: VineBoolean, inUpdate: boolean = false) {
    return inUpdate ? this.optional() : this
})

export function conditionalOptionalArray<T extends SchemaTypes>(
    arr: VineArray<T>,
    inUpdate: boolean
) {
    if (inUpdate) {
        return arr.optional()
    }

    return arr
}

export const getNumericValue = (value: number | string) => {
    if (isNaN(+value)) {
        value = RequestHelper.body()[value]
    }

    return value
}
