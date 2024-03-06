/*
  Warnings:

  - Added the required column `postId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "postId" TEXT NOT NULL,
ADD COLUMN     "typeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPosts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTypes_name_key" ON "UserTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserPosts_name_key" ON "UserPosts"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "UserTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_postId_fkey" FOREIGN KEY ("postId") REFERENCES "UserPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
