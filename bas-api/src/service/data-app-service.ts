import { instance } from '@bas/utils/axios';
import { controllerPath } from '@bas/constant';

export const callLoginFunction = async (username: string, password: string) => {
  try {
    const payload = {
      username,
      password,
    };
    const { data } = await instance.post(
      controllerPath.BAS_VERSION + controllerPath.AUTH_PATH + controllerPath.IDENTIFIER,
      payload
    );
    return data.data || data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
