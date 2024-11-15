import cron from 'node-cron';
import { TIME_ZONE } from '@bas/constant';

const revokedTokens = new Map();

function init() {
  revokedTokens.clear();
  initCron();
}

function revokeToken(token: string, ttlSeconds = 2 * 3600) {
  revokedTokens.set(token, Date.now() + ttlSeconds * 1000);
}

function isTokenRevoked(token: string) {
  const expiry = revokedTokens.get(token);
  if (expiry && expiry > Date.now()) {
    return true;
  }
  revokedTokens.delete(token);
  return false;
}

function cleanup() {
  const now = Date.now();
  revokedTokens.forEach((expiry, token) => {
    if (expiry < now) {
      revokedTokens.delete(token);
    }
  });
}

function initCron() {
  // cron: once per hour
  cron.schedule('* 0 * * *', cleanup, { timezone: TIME_ZONE });
}

export { revokeToken, isTokenRevoked, init };
