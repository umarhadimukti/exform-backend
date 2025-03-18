/*
  Warnings:

  - You are about to drop the column `formId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - Added the required column `form_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_id` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_questionId_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "formId",
DROP COLUMN "questionId",
DROP COLUMN "userId",
ADD COLUMN     "form_id" INTEGER NOT NULL,
ADD COLUMN     "question_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "createdAt",
DROP COLUMN "public",
DROP COLUMN "questionId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "form_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "roleId",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
