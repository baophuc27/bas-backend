import { setupSequelizeHooks } from './hooks/sequelize-hooks';
import sequelizeConnection from './connection';
import { SequelizeInitial } from './init';
export * from './models';

// Thiết lập hooks
setupSequelizeHooks(sequelizeConnection);

// Kết nối database và log trạng thái
sequelizeConnection
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Đồng bộ models nếu cần
const syncDatabase = async () => {
  if (process.env.APP_NAME === 'local') {
    await sequelizeConnection.sync({ alter: true }); // Chỉ sync trong môi trường local
    console.log('Database synced successfully.');
  }
};

// Gọi syncDatabase (nếu cần)
syncDatabase().catch((err) => console.error('Database sync error:', err));

// Xuất `sequelizeConnection`
export { sequelizeConnection, SequelizeInitial };
