import Media from '#modules/media/models/media.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { morphMany, morphOne } from '#start/macros/lucid/relation/index'
import { DEFAULT_MEDIA } from '#modules/media/constants/index.js'

export function hasMedia(collectionName: string = 'other_image') {
    return function (target: any, propertyKey: string) {
        return morphMany(Media, 'model', {
            onQuery(query) {
                return query.where('collection_name', collectionName || DEFAULT_MEDIA)
            },
        })(target, propertyKey)
    }
}

export function hasOneMedia(collectionName: string = 'media') {
    return function (target: any, propertyKey: string) {
        return morphOne(Media, 'model', {
            onQuery(query) {
                return query.where('collection_name', collectionName || DEFAULT_MEDIA)
            },
        })(target, propertyKey)
    }
}

export type OneMediaRelationType = HasOne<typeof Media>
export type MediaRelationType = HasMany<typeof Media>
