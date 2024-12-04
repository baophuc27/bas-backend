import { handleError, isTrustedError } from '@bas/api';
import { logError, logInfo } from '@bas/utils/logger';
import { DB_NAME } from '@bas/config';
import { sequelizeConnection, SequelizeInitial } from '@bas/database';
import dotenv from 'dotenv';
import * as http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { realtimeService } from '@bas/service';
import { handleQueue } from '@bas/service/queue-service';
// import './swagger-config';

const result = dotenv.config({
  path: '.env',
});

if (result.error) {
  throw result.error;
}

console.log(result.parsed);

const SERVER_PORT = process.env.PORT ?? 8008;
const INIT_DEFAULT_DATA = true;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

sequelizeConnection
  .authenticate()
  .then(async () => {
    await SequelizeInitial.syncDb(sequelizeConnection, DB_NAME, INIT_DEFAULT_DATA);
    logInfo('Database connected and synchronized.');

    await handleQueue('example-queue', async (data) => {
      logInfo(`Processing data from example-queue: ${JSON.stringify(data)}`);
    });

    logInfo('Queue handlers registered successfully.');
  })
  .then(() => realtimeService.init(io))
  .catch((error) => {
    logError(`Unable to connect to SQL database: ${DB_NAME}`);
    logError(error);
  });

httpServer.listen(SERVER_PORT, () => logInfo(`The server is running on port: ${SERVER_PORT}`));

process.on('unhandledRejection', (error) => {
  logError(error);
  throw error;
});

process.on('uncaughtException', (error) => {
  handleError(error);

  if (!isTrustedError(error)) {
    process.exit(1);
  }
});
