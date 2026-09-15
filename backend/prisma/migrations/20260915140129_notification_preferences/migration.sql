-- AlterTable
ALTER TABLE "User" ADD COLUMN     "assignmentNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "browserPopups" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dueSoonNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationSound" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "overdueNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "statusNotifications" BOOLEAN NOT NULL DEFAULT true;
