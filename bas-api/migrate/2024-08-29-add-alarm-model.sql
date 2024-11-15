CREATE TABLE bas."Alarm" (
     id SERIAL PRIMARY KEY,
     value DOUBLE PRECISION NULL ,
     zone INTEGER NULL ,
     alarm INTEGER NOT NULL,
     side INTEGER,
     type TEXT NOT NULL,
     "recordId" INTEGER NOT NULL,
     "startTime" TIMESTAMP(6) NOT NULL,
     "endTime" TIMESTAMP(6),
     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "deletedAt" TIMESTAMP(6)
);

ALTER TABLE bas."Alarm" ADD CONSTRAINT fk_Alarm_recordId FOREIGN KEY ("recordId") REFERENCES bas."Record" (id) ON DELETE CASCADE;