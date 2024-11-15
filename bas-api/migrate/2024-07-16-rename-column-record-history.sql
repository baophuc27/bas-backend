DO $$
BEGIN
  ALTER TABLE "RecordHistory" RENAME COLUMN "leftSensorDistance" TO "leftDistance";
  ALTER TABLE "RecordHistory" RENAME COLUMN "rightSensorDistance" TO "rightDistance";
  ALTER TABLE "RecordHistory" RENAME COLUMN "leftSensorSpeed" TO "leftSpeed";
  ALTER TABLE "RecordHistory" RENAME COLUMN "rightSensorSpeed" TO "rightSpeed";
  ALTER TABLE "RecordHistory" RENAME COLUMN "RVelocityAlarm" TO "RSpeedAlarm";
  ALTER TABLE "RecordHistory" RENAME COLUMN "LVelocityAlarm" TO "LSpeedAlarm";
END $$;
