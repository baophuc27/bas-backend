import { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT, DB_HOST } from '@bas/config';
import { Sequelize } from 'sequelize';

const sequelizeConnection = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT ? +DB_PORT : 5432,
  logging: false,
  define: {
    charset: 'utf8mb4',
    collate: 'Vietnamese_CI_AS',
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  timezone: 'Asia/Ho_Chi_Minh',
});

export default sequelizeConnection;
