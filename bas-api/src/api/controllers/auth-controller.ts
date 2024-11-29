import { trace } from '@bas/utils/logger';
import {
  extractBearerToken,
  getIpAddress,
  getValueFromCookie,
  setCookieRefreshToken,
} from '@bas/utils/request';
import { NextFunction, Request, Response } from 'express';
import { revokeTokenService, userService, authService } from '@bas/service';
import { REFRESH_TOKEN_KEY } from '@bas/constant';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const data = await authService.login(username, password, getIpAddress(req));

    setCookieRefreshToken(res, data.refreshToken);
    return res.success(data);
  } catch (error) {
    console.error('Error in authController.login:', error);
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const accessToken = extractBearerToken(req);
    console.log(accessToken);
    const token = refreshToken || getValueFromCookie(req, REFRESH_TOKEN_KEY);
    console.log(token);
    const ipAddress = getIpAddress(req);

    await userService.revokeToken(token, ipAddress);
    await userService.cleanupToken();
    revokeTokenService.revokeToken(accessToken);

    res.clearCookie(REFRESH_TOKEN_KEY);
    return res.success(null, 'Logout successfully');
  } catch (error) {
    trace(logout.name);
    next(error);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const ipAddress = getIpAddress(req);

    const token = getValueFromCookie(req, REFRESH_TOKEN_KEY);
    console.log(token);
    const result = await userService.refreshUserToken(token || refreshToken, ipAddress);
    await userService.cleanupToken();

    setCookieRefreshToken(res, result.refreshToken);

    return res.success(
      {
        data: result.data,
        token: result.token,
        refreshToken: result.refreshToken,
      },
      'Refresh login successfully'
    );
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export default {
  login,
  logout,
  refresh,
};
