export interface RecordDetailDto {
  id: number;
  berthId: number;
  vesselId: number;
  orgId: number;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  mooringStatus: string;
  syncStatus: string;
}
