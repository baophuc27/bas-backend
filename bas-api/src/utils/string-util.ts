import { ORGANIZATION_ID } from "@bas/config";

export const generateRecordSession = (berthId: number, vesselId: number) => {
  return `${ORGANIZATION_ID}-${berthId}-${vesselId}-${new Date().getTime()}`;
}