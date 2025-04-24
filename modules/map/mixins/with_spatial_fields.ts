import { scope } from '@adonisjs/lucid/orm'
import Point from '#modules/map/geometry/point.js'
import CustomModel from '#models/utils/custom_model'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'

export const WithSpatialFields = <T extends NormalizeConstructor<typeof CustomModel>>(
    superClass: T
) => {
    return class extends superClass {
        public assertAllowedColumn(_geometryColumn: string): boolean {
            return true
        }

        static distanceExcludingSelf = scope(
            (query, geometryColumn: string, geometry: Point, distance: number) => {
                this.prototype.assertAllowedColumn(geometryColumn)

                query
                    .whereRaw('ST_Distance(??, ST_GeomFromText(?, ?)) <= ?', [
                        geometryColumn,
                        geometry.toWkt(),
                        geometry.getSrid(),
                        distance,
                    ])
                    .whereRaw('ST_Distance(??, ST_GeomFromText(?, ?)) != 0', [
                        geometryColumn,
                        geometry.toWkt(),
                        geometry.getSrid(),
                    ])

                return query
            }
        )

        static distanceValue = scope((query, geometryColumn: string, geometry: Point) => {
            this.prototype.assertAllowedColumn(geometryColumn)

            query.select(
                query.client.raw('ST_Distance(??, ST_GeomFromText(?, ?)) as distance', [
                    geometryColumn,
                    geometry.toWkt(),
                    geometry.getSrid(),
                ])
            )

            return query
        })

        static distanceSphereValue = scope(
            (
                query,
                geometryColumn: string,
                geometry: Point,
                distanceColumnName: string = 'distance'
            ) => {
                this.prototype.assertAllowedColumn(geometryColumn)

                query.select(
                    query.client.raw(
                        `ST_Distance_Sphere(??, ST_GeomFromText(?, ?)) as ${distanceColumnName}`,
                        [geometryColumn, geometry.toWkt(), geometry.getSrid()]
                    )
                )

                return query
            }
        )

        static distanceSphere = scope(
            (query, geometryColumn: string, geometry: Point, distance: number) => {
                this.prototype.assertAllowedColumn(geometryColumn)

                query.whereRaw('ST_Distance_Sphere(??, ST_GeomFromText(?, ?)) <= ?', [
                    geometryColumn,
                    geometry.toWkt(),
                    geometry.getSrid(),
                    distance,
                ])

                return query
            }
        )

        static distanceSphereExcludingSelf = scope(
            (query, geometryColumn: string, geometry: Point, distance: number) => {
                this.prototype.assertAllowedColumn(geometryColumn)

                query
                    .whereRaw('ST_Distance_Sphere(??, ST_GeomFromText(?, ?)) <= ?', [
                        geometryColumn,
                        geometry.toWkt(),
                        geometry.getSrid(),
                        distance,
                    ])
                    .whereRaw('ST_Distance_Sphere(??, ST_GeomFromText(?, ?)) != 0', [
                        geometryColumn,
                        geometry.toWkt(),
                        geometry.getSrid(),
                    ])

                return query
            }
        )

        static comparison = scope(
            (query, geometryColumn: string, geometry: Point, relationship: string) => {
                this.prototype.assertAllowedColumn(geometryColumn)

                const validRelations = [
                    'within',
                    'crosses',
                    'contains',
                    'disjoint',
                    'equals',
                    'intersects',
                    'overlaps',
                    'touches',
                ]

                if (!validRelations.includes(relationship)) {
                    throw new Error(`Unknown spatial relation function: ${relationship}`)
                }

                query.whereRaw(`ST_${relationship}(??, ST_GeomFromText(?, ?))`, [
                    geometryColumn,
                    geometry.toWkt(),
                    geometry.getSrid(),
                ])

                return query
            }
        )

        static orderBySpatial = scope(
            (
                query,
                geometryColumn: string,
                geometry: Point,
                orderFunction: string,
                direction: string = 'asc'
            ) => {
                this.prototype.assertAllowedColumn(geometryColumn)

                const validOrderFunctions = ['distance', 'distance_sphere']

                if (!validOrderFunctions.includes(orderFunction)) {
                    throw new Error(`Unknown spatial function: ${orderFunction}`)
                }

                query.orderByRaw(`ST_${orderFunction}(??, ST_GeomFromText(?, ?)) ${direction}`, [
                    geometryColumn,
                    geometry.toWkt(),
                    geometry.getSrid(),
                ])

                return query
            }
        )

        static within = scope((query, geometryColumn: string, polygon: Point) => {
            return this.comparison(query, geometryColumn, polygon, 'within')
        })

        static crosses = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'crosses')
        })

        static contains = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'contains')
        })

        static disjoint = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'disjoint')
        })

        static equals = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'equals')
        })

        static intersects = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'intersects')
        })

        static overlaps = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'overlaps')
        })

        static doesTouch = scope((query, geometryColumn: string, geometry: Point) => {
            return this.comparison(query, geometryColumn, geometry, 'touches')
        })

        static orderByDistance = scope(
            (query, geometryColumn: string, geometry: Point, direction: string = 'asc') => {
                return this.orderBySpatial(query, geometryColumn, geometry, 'distance', direction)
            }
        )

        static orderByDistanceSphere = scope(
            (query, geometryColumn: string, geometry: Point, direction: string = 'asc') => {
                return this.orderBySpatial(
                    query,
                    geometryColumn,
                    geometry,
                    'distance_sphere',
                    direction
                )
            }
        )
    }
}
