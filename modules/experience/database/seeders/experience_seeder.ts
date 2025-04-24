import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Experience from '#modules/experience/models/experience.js'

export default class extends BaseSeeder {
    async run() {
        const experiences = [
            {
                title: 'Backend Developer',
                company_id: 1,
                start_date: '2022-01-01', // Use exact date if available
                end_date: null,
                description:
                    'Working as a Backend Developer, specializing in Laravel framework. Responsible for developing scalable and secure backend systems, optimizing database performance, and integrating third-party services.',
                created_at: new Date(),
                updated_at: new Date(),
                priority: 2,
            },
            {
                title: 'Freelance Backend Developer',
                company_id: 3,
                start_date: '2022-01-01',
                end_date: null,
                description:
                    'Worked on various projects as a freelancer, providing backend solutions tailored to clients’ needs, utilizing Laravel and other technologies to deliver high-quality results.',
                created_at: new Date(),
                updated_at: new Date(),
                priority: 3,
            },
            {
                title: 'Backend Developer',
                company_id: 2,
                start_date: '2024-04-01',
                end_date: '2024-07-01',
                description:
                    'Contributed to a project at Wadjet, focusing on backend development with Laravel. Played a key role in building and optimizing APIs, ensuring smooth integration with front-end systems.',
                created_at: new Date(),
                updated_at: new Date(),
                priority: 1,
            },
        ]

        await Experience.query().insert(experiences)
    }
}
