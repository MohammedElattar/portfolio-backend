import { hasOne, hasMany } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { HasOne, HasMany, ModelRelations } from '@adonisjs/lucid/types/relations'
import { getMorphableTypeValue } from '../../../../app/utils/morph.js'

export type MorphOneRelationType<T extends LucidModel> = HasOne<T>
export type MorphManyRelationType<T extends LucidModel> = HasMany<T>

export type MorphRelationOptions<
    RelatedModel extends LucidModel,
    ParentModel extends LucidModel,
    Related extends ModelRelations<RelatedModel, ParentModel>,
> = {
    type?: string
    id?: string
    localKey?: string
    serializeAs?: string | null
    onQuery?(query: Related['builder'] | Related['subQuery']): void
    meta?: any
}

export const generateMorphable = (morphable: string) => {
    return {
        dbType: `${morphable}_type`,
        type: `${morphable}Type`,
        dbId: `${morphable}_id`,
        id: `${morphable}Id`,
    }
}

const getMorphOptions = (
    morphableColumns: ReturnType<typeof generateMorphable>,
    morphableTypeValue: string,
    options?: MorphRelationOptions<LucidModel, LucidModel, any>
) => {
    const morphableType = options?.type ?? morphableColumns.dbType

    return {
        foreignKey: options?.id ?? morphableColumns.id,
        localKey: options?.localKey,
        meta: options?.meta,
        serializeAs: options?.serializeAs,
        onQuery(query: any) {
            query.where(morphableType, morphableTypeValue)

            if (options?.onQuery) {
                return options.onQuery(query)
            }

            return query
        },
    }
}

const morphRelation = (
    relationType: 'morphOne' | 'morphMany',
    model: LucidModel,
    morphable: string,
    options?: MorphRelationOptions<LucidModel, LucidModel, any>
) => {
    return function (target: any, propertyKey: string) {
        const morphableColumns = generateMorphable(morphable)
        const relationOptions = getMorphOptions(
            morphableColumns,
            getMorphableTypeValue(target.constructor),
            options
        )

        const relationMethod = relationType === 'morphOne' ? hasOne : hasMany

        return relationMethod(() => model, relationOptions)(target, propertyKey)
    }
}

export function morphOne<Model extends LucidModel>(
    model: Model,
    morphable: string,
    options?: MorphRelationOptions<Model, LucidModel, HasOne<Model, LucidModel>>
) {
    return morphRelation('morphOne', model, morphable, options)
}

export function morphMany<Model extends LucidModel>(
    model: Model,
    morphable: string,
    options?: MorphRelationOptions<Model, LucidModel, HasMany<Model, LucidModel>>
) {
    return morphRelation('morphMany', model, morphable, options)
}
