export interface VesselDetailDto {
  id: number;
  name: string;
  nameEn: string;
}

export interface BerthDetailDto {
  directionCompass?: number;
  limitZone1?: number;
  limitZone2?: number;
  limitZone3?: number;
  distanceFender?: number;
  distanceDevice?: number;
  id: number;
  orgId: number;
  name: string;
  nameEn: string;
  description: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  currentVessel?: VesselDetailDto;
  device?: BerthDeviceDto[];
  record?: BerthRecordDto;
}

export interface BerthRecordDto {
  id: number;
  berthId: number;
  vesselId: number;
  orgId: number;
  startTime: string;
  sessionId: string;
  endTime?: string | null;
}

export interface BerthDeviceDto {
  id: number;
  name: string;
  nameEn: string;
  orgId: number;
  status: number;
  side: number;
  distance: number;
}
