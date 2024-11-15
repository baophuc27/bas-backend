import { REFRESH_TOKEN_KEY } from '@bas/constant';
import { Request, Response } from 'express';

export const getIpAddress = (req: Request) => {
  return (
    req.headers['x-forwarded-for']?.toString() ||
    req.ip ||
    req.ips[0] ||
    req.socket.remoteAddress ||
    ''
  );
};

export const setCookieRefreshToken = (res: Response, token: string) => {
  const TERM_7_DAYS = 7 * 24 * 60 * 60 * 1000;
  res.cookie(REFRESH_TOKEN_KEY, token, {
    httpOnly: true,
    expires: new Date(Date.now() + TERM_7_DAYS),
    sameSite: 'lax',
  });
};

export const getValueFromCookie = (req: Request, name: string) => {
  const values = parseCookies(req);
  return values[name] || '';
};

export const parseCookies = (request: Request) => {
  const list: any = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
};

export const extractBearerToken = (req: Request) => {
  const [, token] = req.headers.authorization?.split(' ') || [];
  return token || '';
};