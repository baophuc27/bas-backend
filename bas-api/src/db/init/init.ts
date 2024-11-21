import { logError, logInfo, logSuccess } from '@bas/utils/logger';
import { Sequelize } from 'sequelize';
import {
  Account,
  Berth,
  Harbor,
  RefreshToken,
  Role,
  User,
  Vessel,
  Record,
  Sensor,
  AlarmSetting,
  Alarm,
} from '../models';
import { createDefaultAuth, createDefaultDevice, createDefaultHarbor } from './default-data';
import RecordHistory from '../models/record-history-model';

const ALTER = true;
const FORCE = true;

const initDb = async () => {
  await Harbor.sync({ alter: ALTER, force: FORCE }).then(createDefaultHarbor);
  await Sensor.sync({ alter: ALTER, force: FORCE }).then(createDefaultDevice);
  await Role.sync({ alter: ALTER, force: FORCE });
  await User.sync({ alter: ALTER, force: FORCE });
  await Account.sync({ alter: ALTER, force: FORCE }).then(createDefaultAuth);
  await RefreshToken.sync({ alter: ALTER, force: FORCE });
  await Vessel.sync({ alter: ALTER, force: FORCE });
  await Berth.sync({ alter: ALTER, force: FORCE });
  await RecordHistory.sync({ alter: ALTER, force: FORCE });
  await Record.sync({ alter: ALTER, force: FORCE });
  await AlarmSetting.sync({ alter: ALTER, force: FORCE });
  await Alarm.sync({ alter: ALTER, force: FORCE });
};

const syncDb = async (sequelizeConnection: Sequelize, dbName: string, withInitialData: boolean) => {
  logSuccess(`Connected to SQL database: ${dbName}`);
  logInfo('Database is being synchronized...');
  await sequelizeConnection
    .sync()
    .then(async () => {
      if (withInitialData) {
        await initDb();
      }
    })
    .then(() => logSuccess('Sync successfully'))
    .catch((reason) => {
      console.log(reason);
      logError(`SYNC FAILED with: ${reason}`);
    });
};

export { initDb, syncDb };
