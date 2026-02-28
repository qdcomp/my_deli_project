import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_schedules_store" AS ENUM('store_a', 'store_b', 'store_c');
  CREATE TABLE "schedules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"store" "enum_schedules_store" NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"cast_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "schedules_id" integer;
  ALTER TABLE "schedules" ADD CONSTRAINT "schedules_cast_id_casts_id_fk" FOREIGN KEY ("cast_id") REFERENCES "public"."casts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "schedules_cast_idx" ON "schedules" USING btree ("cast_id");
  CREATE INDEX "schedules_updated_at_idx" ON "schedules" USING btree ("updated_at");
  CREATE INDEX "schedules_created_at_idx" ON "schedules" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schedules_fk" FOREIGN KEY ("schedules_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_schedules_id_idx" ON "payload_locked_documents_rels" USING btree ("schedules_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "schedules" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "schedules" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_schedules_fk";
  
  DROP INDEX "payload_locked_documents_rels_schedules_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "schedules_id";
  DROP TYPE "public"."enum_schedules_store";`)
}
