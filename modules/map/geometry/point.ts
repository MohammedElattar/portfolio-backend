import GeometryContract from '#modules/map/contracts/geometry_contract.js'
import * as wkx from 'wkx'
import db from '@adonisjs/lucid/services/db'

export default class Point implements GeometryContract {
    private readonly point: wkx.Point

    constructor(x: number, y: number, srid: number = 4326) {
        this.point = new wkx.Point(x, y, undefined, undefined, srid)
    }

    public getPoint() {
        return this.point
    }

    public toWkt(): string {
        return this.point.toWkt()
    }

    getX() {
        return this.point.x
    }

    getY() {
        return this.point.y
    }

    getSrid(): number {
        return 0
    }

    toRawSQL() {
        return db.raw(`ST_GeomFromText(?, ?)`, [
            `POINT(${this.getX()} ${this.getY()})`,
            this.getSrid(),
        ])
    }
}
