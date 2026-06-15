-- CreateTable
CREATE TABLE "ctf_leaderboard" (
    "id" TEXT NOT NULL,
    "handle" VARCHAR(20) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctf_leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ctf_leaderboard_handle_key" ON "ctf_leaderboard"("handle");

-- CreateIndex
CREATE INDEX "ctf_leaderboard_completedAt_idx" ON "ctf_leaderboard"("completedAt");
