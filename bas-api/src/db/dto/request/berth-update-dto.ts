export interface BerthUpdateDto {
  name: string;
  nameEn: string;
  description: string;
  status?: number;
  directionCompass?: number;
  limitZone1?: number;
  limitZone2?: number;
  limitZone3?: number;
  vesselId?: number;
  distanceFender?: number;
  distanceDevice?: number;
  leftDeviceId?: number;
  rightDeviceId?: number;
}
