import { Harbor } from '@bas/database/models';

export const getHarborInfo = async (orgId: number) => {
  return Harbor.findOne({
    where: { orgId },
  });
};

export const configuration = async (orgId: number, body: any) => {
  return Harbor.update(
    {
      nameEn: body.name,
      ...body,
    },
    {
      where: { orgId },
      returning: true,
    }
  );
};
