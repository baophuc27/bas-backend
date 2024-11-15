import { harborDao } from '@bas/database/dao';
import { BerthFilter } from './typing';
import { HarborDetailDto } from '@bas/database/dto/response/harbor-detail-dto';
import NotFoundException from '@bas/api/errors/not-found-exception';
import { internalErrorCode } from '@bas/constant';

export const getHarborInfo = async (filter: BerthFilter) => {
  const harbor = await harborDao.getHarborInfo();
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
}


export const configuration = async (body: any) => {
  return (await harborDao.configuration(body))[1][0];
}