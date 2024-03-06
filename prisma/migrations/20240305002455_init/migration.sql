/*
  Warnings:

  - The primary key for the `Clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Departments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProjectTypes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Systems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TaskTypes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_directorId_fkey";

-- DropForeignKey
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_systemId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_directorId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_directorId_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Systems" DROP CONSTRAINT "Systems_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Systems" DROP CONSTRAINT "Systems_directorId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTypes" DROP CONSTRAINT "TaskTypes_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_directorId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_typeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectManagers" DROP CONSTRAINT "_ProjectManagers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectManagers" DROP CONSTRAINT "_ProjectManagers_B_fkey";

-- DropForeignKey
ALTER TABLE "_ReportViewers" DROP CONSTRAINT "_ReportViewers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReportViewers" DROP CONSTRAINT "_ReportViewers_B_fkey";

-- DropForeignKey
ALTER TABLE "_TaskManagers" DROP CONSTRAINT "_TaskManagers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskManagers" DROP CONSTRAINT "_TaskManagers_B_fkey";

-- AlterTable
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Clients_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Clients_id_seq";

-- AlterTable
ALTER TABLE "Departments" DROP CONSTRAINT "Departments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Departments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Departments_id_seq";

-- AlterTable
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "directorId" SET DATA TYPE TEXT,
ALTER COLUMN "systemId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Devices_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Devices_id_seq";

-- AlterTable
ALTER TABLE "ProjectTypes" DROP CONSTRAINT "ProjectTypes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProjectTypes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProjectTypes_id_seq";

-- AlterTable
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "statusId" SET DATA TYPE TEXT,
ALTER COLUMN "typeId" SET DATA TYPE TEXT,
ALTER COLUMN "directorId" SET DATA TYPE TEXT,
ALTER COLUMN "deviceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Projects_id_seq";

-- AlterTable
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "directorId" SET DATA TYPE TEXT,
ALTER COLUMN "taskId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reports_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reports_id_seq";

-- AlterTable
ALTER TABLE "Status" DROP CONSTRAINT "Status_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Status_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Status_id_seq";

-- AlterTable
ALTER TABLE "Systems" DROP CONSTRAINT "Systems_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ALTER COLUMN "directorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Systems_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Systems_id_seq";

-- AlterTable
ALTER TABLE "TaskTypes" DROP CONSTRAINT "TaskTypes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "departmentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TaskTypes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TaskTypes_id_seq";

-- AlterTable
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "statusId" SET DATA TYPE TEXT,
ALTER COLUMN "directorId" SET DATA TYPE TEXT,
ALTER COLUMN "projectId" SET DATA TYPE TEXT,
ALTER COLUMN "typeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tasks_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "departmentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_ProjectManagers" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ReportViewers" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_TaskManagers" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "TaskTypes" ADD CONSTRAINT "TaskTypes_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Systems" ADD CONSTRAINT "Systems_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Systems" ADD CONSTRAINT "Systems_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "Systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProjectTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TaskTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectManagers" ADD CONSTRAINT "_ProjectManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectManagers" ADD CONSTRAINT "_ProjectManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskManagers" ADD CONSTRAINT "_TaskManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskManagers" ADD CONSTRAINT "_TaskManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportViewers" ADD CONSTRAINT "_ReportViewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportViewers" ADD CONSTRAINT "_ReportViewers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
