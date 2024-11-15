import { DATE_TIME_FORMAT } from '@bas/constant/format';
import moment from 'moment-timezone';

const DEFAULT_MESSAGE = 'No message';

const now = () => {
  return moment().tz('Asia/Ho_Chi_Minh').format(DATE_TIME_FORMAT);
};

export const trace = (err: any) => {
  console.log('\x1b[31m%s\x1b[0m', '<---------------------------------------------------------------');
  return console.trace(err);
}

export const logError = (err: any) => {
  console.error('\x1b[31m%s\x1b[0m', `[${now()}] - [ERROR] \n - ${err}`);
  console.log('\x1b[31m%s\x1b[0m', '---------------------------------------------------------------/>');
};

export const logInfo = (info: any) => {
  console.log('\x1b[36m%s\x1b[0m', `[${now()}] - [INFO] \n - ${info || DEFAULT_MESSAGE}`);
};

export const log = (info: any) => {
  console.log('\x1b[37m%s\x1b[0m', `[${now()}] - [LOG] \n - ${info || DEFAULT_MESSAGE}`);
};

export const logWarning = (message: any) => {
  console.log('\x1b[33m%s\x1b[0m', `[${now()}] - [WARNING] \n - ${message || DEFAULT_MESSAGE}`);

}
export const logExternal = (message: any) => {
  console.log('\x1b[35m%s\x1b[0m', `[${now()}] - [EXTERNAL] \n - ${message || DEFAULT_MESSAGE}`);
}

export const logSuccess = (message: any) => {
  console.log('\x1b[32m%s\x1b[0m', `[${now()}] - [SUCCESS] \n - ${message || DEFAULT_MESSAGE}`);
}