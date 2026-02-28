import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_casts_special_nomination_fee" AS ENUM('1000', '2000', '3000', '4000', '5000');
  ALTER TABLE "casts" ADD COLUMN "special_nomination_fee" "enum_casts_special_nomination_fee";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "casts" DROP COLUMN "special_nomination_fee";
  DROP TYPE "public"."enum_casts_special_nomination_fee";`)
}
