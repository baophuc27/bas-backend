ALTER TABLE bas."RecordHistory"
    ALTER COLUMN "leftDistance" DROP NOT NULL,
    ALTER COLUMN "rightDistance" DROP NOT NULL,
    ALTER COLUMN "leftSpeed" DROP NOT NULL,
    ALTER COLUMN "rightSpeed" DROP NOT NULL,
    ALTER COLUMN "angle" DROP NOT NULL,
    ALTER COLUMN "angleZone" DROP NOT NULL,
    ALTER COLUMN "angleAlarm" DROP NOT NULL,
    ALTER COLUMN "RDistanceAlarm" DROP NOT NULL,
    ALTER COLUMN "RDistanceZone" DROP NOT NULL,
    ALTER COLUMN "LDistanceAlarm" DROP NOT NULL,
    ALTER COLUMN "LDistanceZone" DROP NOT NULL,
    ALTER COLUMN "RSpeedAlarm" DROP NOT NULL,
    ALTER COLUMN "LSpeedZone" DROP NOT NULL,
    ALTER COLUMN "LSpeedAlarm" DROP NOT NULL,
    ALTER COLUMN "RSpeedZone" DROP NOT NULL;
