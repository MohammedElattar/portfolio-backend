import { SchemaTypes } from '@vinejs/vine/types'
import { createValidator } from './validation_rule_helper.js'
import RequestHelper, { request } from './request_helper.js'

type DataType = Record<string, any>

abstract class Validator {
    protected static data: DataType = {}
    protected allData: DataType = {}

    constructor(data?: DataType) {
        this.setData(data)

        return new Proxy(this, {
            get(target, prop: string, receiver) {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver)
                }

                if (prop in target.allData) {
                    return target.allData[prop]
                }

                return null
            },
        })
    }

    public static get schema(): SchemaTypes {
        throw new Error('Validator subclass must implement static get schema()')
    }

    /**
     * Uses static schema getter
     */
    private static schemaObject(): SchemaTypes {
        return this.schema
    }

    /**
     * Main validate method
     */
    public async validate(): Promise<any> {
        this.prepareForValidation()
        const schema = (this.constructor as typeof Validator).schemaObject()
        const validator = createValidator(schema)
        this.setData(await validator.validate(this.allData))
        this.afterValidation()
        this.baseAfterValidation()

        return this.allData
    }

    public async validated(): Promise<any> {
        return await this.validate()
    }

    /**
     * Set data to be validated
     */
    public setData(data?: DataType) {
        this.allData = data ?? RequestHelper.all()
        Validator.data = this.data
    }

    /**
     * Optionally override to clean/modify request data
     */
    protected prepareForValidation(): void {}

    protected afterValidation(): void {}

    protected replace(data?: DataType) {
        this.setData(data)
    }

    protected merge(data?: DataType) {
        this.setData({ ...this.allData, ...data })
    }

    private baseAfterValidation() {
        for (let key in this.allData) {
            if (this.allData[key] instanceof Date) {
                this.allData[key] = request.input(key)
            }
        }
    }

    [key: string]: any
}

export default Validator
