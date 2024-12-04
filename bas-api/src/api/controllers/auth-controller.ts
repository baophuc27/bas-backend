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
    console.log('refreshToken from data: ' + data.refreshToken);
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
    console.log('Access Token:', accessToken);

    const token = refreshToken || getValueFromCookie(req, REFRESH_TOKEN_KEY);
    console.log('Token to be logged out:', token);

    if (!token) {
      return res.status(400).send({ error: 'No token provided for logout' });
    }

    const ipAddress = getIpAddress(req);
    console.log('IP Address:', ipAddress); // log IP address

    // Kiểm tra xem refreshToken có tồn tại trong cơ sở dữ liệu không
    const result = await userService.revokeToken(token, ipAddress);
    console.log('Revoke Token result:', result); // log kết quả trả về từ revokeToken

    if (result && 'revoked' in result) {
      await userService.cleanupToken();
      revokeTokenService.revokeToken(accessToken);

      res.clearCookie(REFRESH_TOKEN_KEY); // Xóa cookie refreshToken
      return res.success(null, 'Logout successfully');
    } else {
      console.log('Token not found or already revoked');
      return res.status(400).send({ error: 'Invalid token or already revoked' });
    }
  } catch (error) {
    trace(logout.name); // log lỗi khi gọi trace
    next(error); // tiếp tục xử lý lỗi
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    console.log('Refresh Token:', refreshToken);
    const ipAddress = getIpAddress(req);
    console.log('IP Address:', ipAddress);
    const token = getValueFromCookie(req, REFRESH_TOKEN_KEY);
    console.log('Token: ', token);
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
