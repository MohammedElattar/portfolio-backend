import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PointMigrationHelper {
    public static async up(schema: any): Promise<void> {
        await schema.raw('ALTER TABLE `clients` MODIFY `location` POINT NOT NULL;')
        await schema.raw('ALTER TABLE `clients` ADD SPATIAL INDEX (`location`);')
        await schema.raw(`
      CREATE TRIGGER set_default_location
      BEFORE INSERT ON \`clients\`
      FOR EACH ROW
      BEGIN
        IF NEW.location IS NULL THEN
          SET NEW.location = ST_GeomFromText('POINT(0 0)');
        END IF;
      END;
    `)
    }

    public static async down(knex: BaseSchema): Promise<void> {
        await knex.raw('DROP TRIGGER IF EXISTS set_default_location;')
        await knex.raw('ALTER TABLE `clients` DROP INDEX `location`;')
    }
}
