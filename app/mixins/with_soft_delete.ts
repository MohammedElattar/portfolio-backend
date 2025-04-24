import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

import CustomModel from '#models/utils/custom_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { Exception } from '@poppinss/utils'

export const SOFT_DELETE_SCOPE = 'softDeletes'

export function WithSoftDeletes(options?: { columnName?: string }) {
    const deletedAtColumn = options?.columnName ?? 'deleted_at'

    return function WithSoftDeletes<T extends NormalizeConstructor<typeof CustomModel>>(
        superclass: T
    ) {
        class SoftDeletesModel extends superclass {
            static deletedColumn = deletedAtColumn
            @column.dateTime({ columnName: deletedAtColumn })
            declare deletedAt: DateTime | null

            $forceDelete = false
            $isDeleted = false

            get isTrashed(): boolean {
                return this.deletedAt !== null
            }

            static boot() {
                super.boot()

                // this.addGlobalScope(SOFT_DELETE_SCOPE, (query) => {
                //     query.whereNull(`${query.model.table}.${deletedAtColumn}`)
                // })
            }

            static withTrashed<Model extends typeof SoftDeletesModel>(
                this: Model
            ): ModelQueryBuilderContract<Model> {
                return this.query().withTrashed()
            }

            static onlyTrashed<Model extends typeof SoftDeletesModel>(
                this: Model
            ): ModelQueryBuilderContract<Model> {
                return this.query().onlyTrashed()
            }

            async delete(): Promise<void> {
                if (this.$forceDelete) {
                    await super.delete()
                    this.$isDeleted = true
                    return
                }

                this.deletedAt = DateTime.local()
                await this.save()
            }

            async forceDelete(): Promise<void> {
                this.$forceDelete = true
                await this.delete()
            }

            async restore(): Promise<this> {
                if (this.$isDeleted) {
                    throw new Exception('Cannot restore a model instance that was force deleted', {
                        code: 'E_MODEL_FORCE_DELETED',
                        status: 500,
                    })
                }

                if (!this.deletedAt) {
                    return this
                }

                this.deletedAt = null
                await this.save()
                return this
            }
        }

        return SoftDeletesModel
    }
}
