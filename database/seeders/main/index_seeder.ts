import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { QueryClientContract } from '@adonisjs/lucid/types/database'

export default class IndexSeeder extends BaseSeeder {
    public static async seed(Seeder: { default: typeof BaseSeeder }, client: QueryClientContract) {
        // /**
        //  * Do not run when not in a environment specified in Seeder
        //  */
        // if (
        //   !Seeder.default.environment ||
        //   (!Seeder.default.environment.includes('development') && app.inDev) ||
        //   (!Seeder.default.environment.includes('testing') && app.inTest) ||
        //   (!Seeder.default.environment.includes('production') && app.inProduction)
        // ) {
        //   return
        // }

        await new Seeder.default(client).run()
    }

    async run() {
        await IndexSeeder.seed(
            await import('#modules/auth/database/seeders/auth_database_seeder.js'),
            this.client
        )
        await IndexSeeder.seed(
            await import('#modules/company/database/seeders/company_seeder.js'),
            this.client
        )
        await IndexSeeder.seed(
            await import('#modules/experience/database/seeders/experience_seeder.js'),
            this.client
        )

        await IndexSeeder.seed(
            await import('#modules/setting/database/seeders/setting_seeder.js'),
            this.client
        )
    }
}
