import { BaseModel, CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'
import { LucidModel, ModelAssignOptions, ModelAttributes } from '@adonisjs/lucid/types/model'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import string from '@adonisjs/core/helpers/string'
import db from '@adonisjs/lucid/services/db'
import Point from '#modules/map/geometry/point.js'
import { isObjectEmpty } from '../../utils/general.js'
import { WithGlobalScopes } from '../../mixins/with_global_scope.js'
import { compose } from '@adonisjs/core/helpers'

export default class CustomModel extends compose(BaseModel, WithGlobalScopes) {
    public static namingStrategy = new (class extends CamelCaseNamingStrategy {
        serializedName(_model: typeof BaseModel, propertyName: string) {
            return string.snakeCase(propertyName)
        }
    })()
    protected static $fillable: string[] = []

    serializeExtras = true

    public static async create<T extends LucidModel>(
        this: T,
        values: Partial<ModelAttributes<InstanceType<T>>>,
        options?: ModelAssignOptions
    ): Promise<InstanceType<T>> {
        // @ts-ignore
        const safeData = (this as typeof CustomModel).onlyFillableValues(
            values as Record<string, any>
        )

        const created = await (super.create as unknown as T['create'])(safeData, {
            allowExtraProperties: false,
            ...options,
        })
        return created as InstanceType<T>
    }

    public static onlyFillableValues(values: Record<string, any>) {
        const safeData: Record<string, any> = {}

        if (this.$fillable && Array.isArray(this.$fillable) && this.$fillable[0] !== undefined) {
            Object.keys(values).forEach((key) => {
                if (this.$fillable.includes(key)) {
                    safeData[key] = values[key]
                }
            })

            return safeData
        }

        return values
    }

    public static getPrimaryKey(): string {
        return this.primaryKey || 'id'
    }

    async update(
        values: Partial<ModelAttributes<this>>,
        trx?: TransactionClientContract,
        allowExtraProperties: boolean = false
    ): Promise<this> {
        if (trx) {
            this.useTransaction(trx)
        }

        const safeData: Record<string, any> = (
            this.constructor as typeof CustomModel
        ).onlyFillableValues(values as Record<string, any>)
        const spatialFields: Record<string, Point> = {}

        for (const key of Object.keys(safeData)) {
            if (safeData[key] instanceof Point) {
                spatialFields[key] = safeData[key]
                delete safeData[key]
            }
        }

        if (isObjectEmpty(spatialFields)) {
            return await this.merge(
                safeData as Partial<ModelAttributes<this>>,
                allowExtraProperties
            ).save()
        }

        const allFields = { ...safeData, ...spatialFields }
        const [sql, bindings] = this.parseQuery(allFields)

        await db.rawQuery(sql, bindings, { mode: 'write' })

        return this
    }

    relationLoaded(relation: string) {
        return this.$preloaded[relation] !== undefined
    }

    private parseQuery(data: Record<string, any>): [string, any[]] {
        const setClauses: string[] = []
        const bindings: any[] = []

        for (const [key, value] of Object.entries(data)) {
            if (value instanceof Point) {
                setClauses.push(`\`${key}\` = ST_GeomFromText(?, ?)`)
                bindings.push(`POINT(${value.getX()} ${value.getY()})`, value.getSrid())
            } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                setClauses.push(`\`${key}\` = ?`)
                bindings.push(JSON.stringify(value))
            } else {
                setClauses.push(`\`${key}\` = ?`)
                bindings.push(value)
            }
        }

        const sql = `UPDATE \`${(this.constructor as typeof CustomModel).table}\` SET ${setClauses.join(', ')} WHERE \`id\` = ?`
        bindings.push(this.$primaryKeyValue)

        return [sql, bindings]
    }
}
