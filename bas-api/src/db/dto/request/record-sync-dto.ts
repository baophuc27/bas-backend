
export interface RecordData {
    orgId: number;
    berthId: number;
    time : Date;
    recordId : number;
    leftDistance : number;
    leftSpeed : number;
    rightDistance : number;
    rightSpeed : number;
    angle : number;
    angleZone : number;
    lspeedZone : number;
    ldistanceZone : number;
    rdistanceZone : number;
    rspeedZone : number;
    leftStatus : number;
    rightStatus : number;
    angleAlarm: number;
    createdAt: String;
    updatedAt: String;
    deletedAt: String;
  }
  
export interface RecordSyncDto {
    frame : RecordData[];
  }
  