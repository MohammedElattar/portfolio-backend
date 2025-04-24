import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Company from '#modules/company/models/company.js'

export default class extends BaseSeeder {
    async run() {
        const companies = [{ name: 'Doctor Code' }, { name: 'Code Zone' }, { name: 'Freelance' }]
        await Company.query().insert(companies)
    }
}
