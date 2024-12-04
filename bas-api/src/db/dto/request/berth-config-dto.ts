

export interface VesselDto {
  id?: number;
  name: string;
  width: number;
  beam: number;
  flag: string;
  type?: number | null;
  builder?: string | null;
  built?: string | null;
  owner?: string | null;
  manager?: string | null;
  maxDraught?: string | null;
  class?: string | null;
  nt?: string | null;
  gt?: string | null;
  teu?: string | null;
  dwt?: string | null;
  gas?: string | null;
  crude?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  speed?: number | null;
  callSign?: string | null;
}

export interface BerthConfigDto {
  status: number;
  distanceToLeft: number;
  distanceToRight: number;
  show: boolean;
  vesselDirection: boolean;
  vessel?: VesselDto;
  
}