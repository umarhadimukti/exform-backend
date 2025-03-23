-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "options" DROP NOT NULL,
ALTER COLUMN "options" SET DEFAULT '[]';
