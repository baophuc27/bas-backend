export interface AlarmDto {
  value: number;
  alarm: number;
  zone: number;
  startTime: Date;
  endTime?: Date | null;
  type: string;
  message?: string | null;
  side: number;
  record: {
    id: number;
    sessionId: string;
    berth: {
      name: string,
      nameEn: string
    }
  }
  sensor: {
    id: number;
    name: string;
  }
}

