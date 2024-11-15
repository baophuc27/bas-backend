DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='Record' and column_name='anchoringStatus')
  THEN
      ALTER TABLE "Record" RENAME COLUMN "anchoringStatus" TO "mooringStatus";
  END IF;
END $$;
