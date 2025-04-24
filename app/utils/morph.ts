import CustomModel from '#models/utils/custom_model'

export function getMorphableTypeValue(model: typeof CustomModel) {
    return model.table
}
