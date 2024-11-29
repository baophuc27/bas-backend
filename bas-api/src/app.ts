import { NotFound } from '@bas/api/errors';
import { errorHandler, responseHandler } from '@bas/api/middleware/handler';
import routes from '@bas/api/routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import { queueService } from './service';
// import swaggerUi from 'swagger-ui-express';
// import { outputFile } from './swagger-config';

const API_PATH_VERSION = '/api';
const app = express();

import { connectRedis } from '@bas/utils/redis-client';

(async () => {
  try {
    await connectRedis();
    console.log('Redis client connected successfully.');
  } catch (error) {
    console.error('Failed to connect Redis:', error);
  }
})();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/public', express.static('public'));

app.use(responseHandler);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require(outputFile)));

app.post('/push-queue', async (req, res) => {
  const { queueName, data } = req.body;
  console.log(queueName, data);
  await queueService.pushToQueue(queueName, data);
  res.send('ok');
});

app.get('/execute-queue', async (req, res) => {
  const { queueName } = req.query;
  await queueService.handleQueue(queueName as string, async (data: any) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, 5000);
    });
  });
  res.send('ok');
});

app.use(`${API_PATH_VERSION}`, routes);

app.use('*', (req, res, next: NextFunction) => {
  const err = new NotFound('Undefined route');
  next(err);
});

app.use(errorHandler);

export default app;
