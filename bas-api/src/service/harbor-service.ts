import { harborDao } from '@bas/database/dao';
import NotFoundException from '@bas/api/errors/not-found-exception';
import { HarborDetailDto } from '@bas/database/dto/response/harbor-detail-dto';
import { internalErrorCode } from '@bas/constant';

export const getHarborInfo = async (orgId: number) => {
  const harbor = await harborDao.getHarborInfo(orgId);
  if (!harbor) {
    throw new NotFoundException('Harbor not found', internalErrorCode.RESOURCE_NOT_FOUND);
  }

  const data: HarborDetailDto = {
    name: harbor.name,
    nameEn: harbor.nameEn,
    description: harbor.description,
    address: harbor.address,
    weatherWidgetUrl: harbor.weatherWidgetUrl,
    weatherWidgetDashboardUrl: harbor.weatherWidgetDashboardUrl,
  };
  return data;
};

export const configuration = async (orgId: number, body: any) => {
  return (await harborDao.configuration(orgId, body))[1][0];
};
