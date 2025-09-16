-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_spaceId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
