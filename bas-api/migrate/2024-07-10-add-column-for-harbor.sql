ALTER TABLE "Harbor" ADD COLUMN
      IF NOT EXISTS "weatherWidgetDashboardUrl" VARCHAR(255) NULL ;
ALTER TABLE "Harbor" ADD COLUMN
      IF NOT EXISTS "weatherWidgetUrl" VARCHAR(255) NULL ;