/*
  Warnings:

  - The primary key for the `forms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_form_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_form_id_fkey";

-- AlterTable
ALTER TABLE "answers" ALTER COLUMN "form_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "forms" DROP CONSTRAINT "forms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "forms_id_seq";

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "form_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
