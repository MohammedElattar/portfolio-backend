import Point from '#modules/map/geometry/point.js'
import GeometryContract from '#modules/map/contracts/geometry_contract.js'
import * as wkx from 'wkx'

export default class LineString implements GeometryContract {
    private lineString: wkx.LineString

    constructor(points: Point[], srid?: number) {
        this.lineString = new wkx.LineString(
            points.map((point) => point.getPoint()),
            srid
        )
    }

    toWkt(): string {
        return this.lineString.toWkt()
    }

    getSrid(): number {
        return 0
    }
}
