import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Setting from '#modules/setting/models/setting.js'

export default class extends BaseSeeder {
    async run() {
        await Setting.create({
            name: 'Mohamed Attar',
            headline: 'Backend Developer Specializing in Laravel and Exploring .NET',
            github: 'https://github.com/MohammedElattar',
            linkedin: 'https://www.linkedin.com/in/mohamed-ahmed-attar',
            whatsapp: 'https://wa.me/201006131248',
            email: 'mohammedattar0100020@gmail.com',
            resumeUrl: 'https://drive.google.com/file/d/1Zd9ubyrqUJAPzLZ4gdU4xpGng5yf9-XA/preview',
        })
    }
}
