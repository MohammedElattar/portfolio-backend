import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import {
    kDeletedGlobalScopes,
    kDiscardAllGlobalScopes,
} from '#start/macros/lucid/queryBuilder/global_scope'
import { BaseModel, beforeFetch, beforeFind, beforePaginate } from '@adonisjs/lucid/orm'
import CustomModel from '#models/utils/custom_model'

export const kGlobalScopes = Symbol('adonis.custom.globalScopes')
export type GlobalScopeMap = Map<
    string,
    (query: ModelQueryBuilderContract<typeof BaseModel>) => void
>

const scopeStorage = new WeakMap<any, GlobalScopeMap>()

export const WithGlobalScopes = <T extends NormalizeConstructor<typeof BaseModel>>(
    superClass: T
) => {
    class ParentClass extends superClass {
        static get [kGlobalScopes](): GlobalScopeMap {
            if (!scopeStorage.has(this)) {
                scopeStorage.set(this, new Map())
            }
            return scopeStorage.get(this)!
        }

        public static addGlobalScope(
            name: string,
            callback: (query: ModelQueryBuilderContract<typeof BaseModel>) => void
        ) {
            this[kGlobalScopes].set(name, callback)
        }

        @beforePaginate()
        static applyGlobalScopesBeforePaginate(
            queries: ModelQueryBuilderContract<typeof BaseModel>[]
        ) {
            this.baseGlobalScopeApply(queries[0])
        }

        @beforeFetch()
        @beforeFind()
        public static applyGlobalScopes(query: ModelQueryBuilderContract<typeof BaseModel>) {
            this.baseGlobalScopeApply(query)
        }

        private static baseGlobalScopeApply(query: ModelQueryBuilderContract<typeof BaseModel>) {
            const model = query.model as typeof CustomModel
            const discardAll = query[kDiscardAllGlobalScopes]
            const deletedScopes: Set<string> = query[kDeletedGlobalScopes] || new Set()

            if (discardAll) return

            const scopes = model[kGlobalScopes] as GlobalScopeMap

            if (!scopes) return

            for (const [key, callback] of scopes) {
                if (deletedScopes.has(key)) continue
                callback(query)
            }
        }
    }

    return ParentClass
}
