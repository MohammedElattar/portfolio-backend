import HttpContextHelper from '../utils/response_helper.js'

class MissingValue {}

class MergeValue {
    data

    constructor(data) {
        this.data = data
    }
}

class BaseResource {
    resource
    ctx

    static wrap = null

    constructor(resource) {
        this.resource = resource
        this.ctx = HttpContextHelper.get()

        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver)
                }

                return target.resource[prop]
            },
        })
    }

    static async make(item) {
        if (item === undefined) {
            return this._getMissingValue()
        }

        return await this._filter(await new this(item).toObject(item))
    }

    static async collection(items) {
        const filteredItems = await Promise.all(items.map((item) => this.make(item)))

        if (this.wrap) {
            return {
                data: filteredItems,
            }
        }

        return filteredItems
    }

    static wrap(value) {
        BaseResource.wrap = value
    }

    static withoutWrap() {
        BaseResource.wrap = null
    }

    async toObject(model) {
        return model.serialize()
    }

    static async _filter(item) {
        const entries = await Promise.all(
            Object.entries(item).map(async ([key, value]) => {
                const resolved = typeof value === 'function' ? await value() : await value
                return [key, resolved]
            })
        )

        const filtered = {}

        for (const [key, value] of entries) {
            if (value !== undefined && !(value instanceof MissingValue)) {
                if (value instanceof MergeValue) {
                    const keys = Object.keys(value)

                    keys.forEach((key) => {
                        filtered[key] = value[key]
                    })
                    return
                }

                filtered[key] = value
            }
        }

        return filtered
    }

    whenNotNull(value, defaultValue = null) {
        return this.when(value !== null, value, defaultValue)
    }

    whenNull(value, defaultValue = null) {
        return this.when(value === null, value, defaultValue)
    }

    async whenLoaded(relation, value = null) {
        if (this.resource.$preloaded[relation] === undefined) {
            return this._getMissingValue()
        }

        if (arguments.length === 1) {
            return this.resource.$preloaded[relation]
        }

        return await this._getValuePromise(value)
    }

    when(condition, value, defaultValue = null) {
        if (!this._getConditionValue(condition)) {
            return this._getMissingValue()
        }

        const parsedValue = this._getValue(value)

        if (parsedValue !== undefined) {
            return parsedValue
        }

        return this._getValue(defaultValue)
    }

    mergeWhen(condition, value, defaultValue = undefined) {
        if (this._getConditionValue(condition)) {
            return this._getMergeValue(value)
        }

        return arguments.length === 3 ? this._getMergeValue(defaultValue) : this._getMissingValue()
    }

    mergeUnless(condition, value, defaultValue = undefined) {
        const args = arguments.length === 2 ? [value] : [value, defaultValue]

        return this.mergeWhen(!this._getConditionValue(condition), ...args)
    }

    whenHas(attribute, value = undefined, defaultValue = undefined) {
        if (arguments.length < 3) {
            defaultValue = this._getMissingValue()
        }

        if (!this.attributeExists(attribute, this.resource)) {
            return this._getValue(defaultValue)
        }

        return arguments.length === 1
            ? this._getValue(this.resource[attribute])
            : this._getValue(value)
    }

    whenHasExtra(attribute, value = undefined) {
        if (this.resource.$extras && this.resource.$extras[attribute] !== undefined) {
            return this._getValue(value) || this.resource.$extras[attribute]
        }

        return this._getMissingValue()
    }

    _getValue(value) {
        if (value instanceof MissingValue) {
            return value
        }

        if (typeof value == 'function') {
            value = value.bind(this.resource)
            return value()
        }

        return value
    }

    async _getValuePromise(value) {
        if (value instanceof MissingValue) {
            return value
        }

        if (typeof value === 'function') {
            value = value.bind(this.resource)
            return await value()
        }

        return value
    }

    _getValueOrDefault(value, defaultValue) {
        const val = this._getValue(value)

        if (val !== undefined) {
            return val
        }

        return this._getValue(defaultValue)
    }

    _getMissingValue() {
        return new MissingValue()
    }

    _getMergeValue(value) {
        return new MergeValue(this._getValue(value))
    }

    _getConditionValue(condition) {
        if (typeof condition == 'function') {
            return condition()
        }

        return condition
    }

    attributeExists(attribute, resource) {
        return (
            (attribute in resource.$attributes || attribute in resource) &&
            this.resource[attribute] !== undefined
        )
    }
}

export default BaseResource
