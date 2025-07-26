-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "nurse_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "Nurse" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nurse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "special_condition" TEXT NOT NULL DEFAULT 'NONE'
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ScheduleRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "min_nurses_per_shift" INTEGER NOT NULL,
    "max_consecutive_days" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "request_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "target_nurse_id" INTEGER,
    "source_assignment_id" INTEGER,
    "target_assignment_id" INTEGER,
    "leave_start_date" DATETIME,
    "leave_end_date" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "Nurse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Request_target_nurse_id_fkey" FOREIGN KEY ("target_nurse_id") REFERENCES "Nurse" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Request_source_assignment_id_fkey" FOREIGN KEY ("source_assignment_id") REFERENCES "ScheduleAssignment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Request_target_assignment_id_fkey" FOREIGN KEY ("target_assignment_id") REFERENCES "ScheduleAssignment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScheduleAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "assignment_type" TEXT NOT NULL DEFAULT 'AUTOMATED',
    "nurse_id" INTEGER NOT NULL,
    "shift_id" INTEGER NOT NULL,
    CONSTRAINT "ScheduleAssignment_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "Nurse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScheduleAssignment_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "Shift" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_nurse_id_key" ON "User"("nurse_id");

-- CreateIndex
CREATE UNIQUE INDEX "Request_source_assignment_id_key" ON "Request"("source_assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Request_target_assignment_id_key" ON "Request"("target_assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleAssignment_date_nurse_id_key" ON "ScheduleAssignment"("date", "nurse_id");
