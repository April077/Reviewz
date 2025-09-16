-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "sentiment" TEXT,
ADD COLUMN     "sentimentScore" DOUBLE PRECISION,
ADD COLUMN     "tags" TEXT[];
