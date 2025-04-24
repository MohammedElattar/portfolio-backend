import GeometryContract from '#modules/map/contracts/geometry_contract.js'
import * as wkx from 'wkx'
import Point from '#modules/map/geometry/point.js'

export default class Polygon implements GeometryContract {
    private polygon: wkx.Polygon

    constructor(points: Point[]) {
        this.polygon = new wkx.Polygon(points.map((point) => point.getPoint()))
    }

    toWkt(): string {
        return this.polygon.toWkt()
    }

    getSrid(): number {
        return 0
    }
}
