import { BaseModel } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { HttpContext } from '@adonisjs/core/http'
declare module '../resources/resource.js' {
    type Closure = () => unknown
    type DefaultValueType = undefined | Closure

    export default class BaseResource<T = BaseModel> {
        public resource: T
        private ctx: HttpContext
        static wrap: string | null

        constructor(resource: T)

        static make<T>(item: T): Promise<BaseResource<T>>
        static collection<T>(items: T[]): Promise<BaseResource<T>[]>
        static paginatedCollection<Model extends LucidModel>()
        static wrap(value: string): void
        static withoutWrap(): void

        toObject(model: T): Promise<unknown>
        whenLoaded<B>(relation: string, value?: V): Promise<V | DefaultValueType>
        whenNotNull<V>(value: V, defaultValue?: V | DefaultValueType): V | DefaultValueType
        whenNull<V>(value: V, defaultValue?: V | null): V | null
        when<V>(condition: boolean, value: V, defaultValue?: V | null): V | null
        mergeWhen<V>(condition: boolean, value: V): V | null
        whenHas<V>(
            attribute: string,
            value?: DefaultValueType,
            defaultValue?: DefaultValueType
        ): unknown
        whenHasExtra<V>(
            attribute: string,
            value?: DefaultValueType,
            defaultValue?: DefaultValueType
        ): unknown

        [key: string]: any
    }
}
