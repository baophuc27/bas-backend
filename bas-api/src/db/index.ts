import { setupSequelizeHooks } from './hooks/sequelize-hooks';
import sequelizeConnection from './connection';
import { SequelizeInitial } from './init';
export * from './models';

setupSequelizeHooks(sequelizeConnection);

sequelizeConnection
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const syncDatabase = async () => {
  if (process.env.APP_NAME === 'local') {
    await sequelizeConnection.sync({ alter: true });
    console.log('Database synced successfully.');
  }
};

syncDatabase().catch((err) => console.error('Database sync error:', err));

export { sequelizeConnection, SequelizeInitial };
