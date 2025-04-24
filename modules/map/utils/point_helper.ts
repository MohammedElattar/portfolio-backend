import Point from '#modules/map/geometry/point.js'

export default class PointHelper {
    public static getCoordinates(point: Point) {
        return { latitude: point.getY(), longitude: point.getX() }
    }

    public static replaceLatLngWithLocation(data: {
        latitude?: number | string
        longitude?: number | string
        [key: string]: any
    }): void {
        if (data.latitude !== undefined && data.longitude !== undefined) {
            data.location = new Point(data.longitude as number, data.latitude as number)
            delete data.latitude
            delete data.longitude
        }
    }
}
