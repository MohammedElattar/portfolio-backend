import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import { alphaTypes, UserTypeEnum } from '../../enums/user_type_enum.js'
import { DateTime } from 'luxon'

export default class AuthDatabaseSeeder extends BaseSeeder {
    async run() {
        for (const [key, value] of Object.entries(alphaTypes) as [string, UserTypeEnum][]) {
            await User.create({
                name: faker.person.fullName(),
                email: `${key}@admin.com`,
                password: key,
                type: value,
                emailVerifiedAt: DateTime.now(),
                status: true,
            })
        }
    }
}
