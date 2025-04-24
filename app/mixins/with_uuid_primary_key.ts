import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import CustomModel from '#models/utils/custom_model'
import { beforeCreate } from '@adonisjs/lucid/orm'
import { v4 } from 'uuid'
export const WithHasUuids = <T extends NormalizeConstructor<typeof CustomModel>>(superClass: T) => {
    class parentClass extends superClass {
        @beforeCreate()
        public static async addUidHook(model: T) {
            // @ts-ignore
            model[model.constructor.getPrimaryKey()] = v4()
        }
    }

    return parentClass
}
