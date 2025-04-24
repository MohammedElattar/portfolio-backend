import { DecoratorFn } from '@adonisjs/lucid/types/model'
import { column } from '@adonisjs/lucid/orm'
import Point from '#modules/map/geometry/point.js'

type PointOptions = {
    column?: string
}

export type PointType = (options?: PointOptions) => DecoratorFn

export const point: PointType = (_options?: PointOptions) => {
    return column({
        prepare: (value: Point) => {
            return value.toRawSQL()
        },
        consume: (value: any) => {
            return new Point(value?.x ?? 0, value?.y ?? 0)
        },
        serialize: (value: Point) => {
            return { x: value?.getX() ?? 0, y: value?.getY() ?? 0 }
        },
    })
}
