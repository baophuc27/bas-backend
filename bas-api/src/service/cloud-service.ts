import { ORGANIZATION_ID, CLOUD_API_KEY_EXPIRES } from '@bas/config';
import { getPem } from '@bas/config/keys';
import { axiosCloud, encrypt } from '@bas/utils';
import { ENTRY_POINT } from '@bas/constant';
import fs from 'fs';

const getAPIKey = async () => {
  const date = new Date().getTime() + Number(CLOUD_API_KEY_EXPIRES);
  const content = `${ORGANIZATION_ID}_${date}`;
  const publicKey = getPem();
  return encrypt(content, publicKey);
};

const syncRecordToCloud = async (data: any) => {
  try {
    const res = await axiosCloud.post(ENTRY_POINT.SYNC_PATH, data, {
      headers: {
        X_API_KEY: await getAPIKey(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return !!res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { syncRecordToCloud };
