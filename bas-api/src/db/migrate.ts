import { logInfo, logSuccess, logError } from '@bas/utils/logger';
import { SequelizeStorage, Umzug } from 'umzug';
import sequelizeConnection from './connection';

const migrator = new Umzug({
  migrations: {
    glob: 'migrations/*.js', // Đường dẫn tới file migration
  },
  storage: new SequelizeStorage({ sequelize: sequelizeConnection }),
  context: sequelizeConnection.getQueryInterface(),
  logger: console,
});

export const migrateUp = async () => {
  logInfo('Running migrations...');
  try {
    const migrations = await migrator.up();
    migrations.forEach((migration) =>
      logSuccess(`Migration ${migration.name} applied successfully.`)
    );
  } catch (err) {
    logError(`Migration failed: ${err}`);
    throw err;
  }
};

export const migrateDown = async () => {
  logInfo('Rolling back migrations...');
  try {
    const migrations = await migrator.down();
    migrations.forEach((migration) =>
      logSuccess(`Migration ${migration.name} rolled back successfully.`)
    );
  } catch (err) {
    logError(`Rollback failed: ${err}`);
    throw err;
  }
};
