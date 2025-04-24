import { ModelQueryBuilder } from '@adonisjs/lucid/orm'

export const kDeletedGlobalScopes = Symbol.for('adonis.custom.deletedGlobalScopes')
export const kDiscardAllGlobalScopes = Symbol.for('adonis.custom.discardAllGlobalScopes')
export const kGlobalScopes = Symbol.for('adonis.custom.globalScopes')
declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<
        Model extends LucidModel,
        Result extends InstanceType<Model> = InstanceType<Model>,
    > {
        [kDeletedGlobalScopes]?: Set<string>
        [kGlobalScopes]: Map<string, ModelQueryBuilderContract<Model>>
        [kDiscardAllGlobalScopes]?: boolean
        /**
         * Ignore a global scope
         */
        withoutGlobalScope(name: string): this

        /**
         * Ignore global scopes, if undefined is passed, then ignore all global scopes
         */
        withoutGlobalScopes(names?: string[]): this
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        withoutGlobalScope(name: string): this
        withoutGlobalScopes(names?: string[]): this
    }
}

ModelQueryBuilder.macro('withoutGlobalScope', function (this: any, name: string) {
    if (!this[kDeletedGlobalScopes]) {
        this[kDeletedGlobalScopes] = new Set<string>()
    }

    this[kDeletedGlobalScopes].add(name)
    return this
})

ModelQueryBuilder.macro('withoutGlobalScopes', function (this: any, names?: string[]) {
    if (!this[kDeletedGlobalScopes]) {
        this[kDeletedGlobalScopes] = new Set<string>()
    }

    if (!names) {
        this[kDiscardAllGlobalScopes] = true
        return this
    }

    names.forEach((name) => {
        this[kDeletedGlobalScopes].add(name)
    })

    return this
})

const originalWithAggregate = ModelQueryBuilder.prototype.withAggregate
ModelQueryBuilder.macro(
    'withAggregate',
    function (this: ModelQueryBuilder, relationName: string, userCallback: any) {
        return originalWithAggregate.call(this, relationName, (query: any) => {
            userCallback(query)
            query.model.applyGlobalScopes(query)
        })
    }
)

// @ts-ignore
const originalAddWhereHas = ModelQueryBuilder.prototype.addWhereHas
ModelQueryBuilder.macro(
    // @ts-ignore
    'addWhereHas',
    function (
        this: ModelQueryBuilder,
        relationName: any,
        boolean: any,
        operator: any,
        value: any,
        callback: any
    ) {
        return originalAddWhereHas.call(
            this,
            relationName,
            boolean,
            operator,
            value,
            (query: any) => {
                if (callback) {
                    callback(query)
                }
                query.model.applyGlobalScopes(query)
            }
        )
    }
)
