import { Harbor } from '@bas/database/models';

const DEFAULT_HARBOR_ID = 1;

export const getHarborInfo = async () => {
  return Harbor.findOne({
    where: {
      id: DEFAULT_HARBOR_ID
    }
  });
}

export const configuration = async (body: any) => {
  return await Harbor.update({
    nameEn: body.name,
    ...body
  }, {
    where: {
      id: DEFAULT_HARBOR_ID
    },
    returning: true
  });
}