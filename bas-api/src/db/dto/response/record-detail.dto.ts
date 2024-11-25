export interface RecordDetailDto {
  id: number;
  berthId: number;
  vesselId: number;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  mooringStatus: string;
  syncStatus: string;
  orgId: number;
}
