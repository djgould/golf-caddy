-- CreateTable
CREATE TABLE "hole_scores" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "holeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "putts" INTEGER,
    "fairway" BOOLEAN,
    "gir" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hole_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hole_scores_roundId_idx" ON "hole_scores"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "hole_scores_roundId_holeId_key" ON "hole_scores"("roundId", "holeId");

-- AddForeignKey
ALTER TABLE "hole_scores" ADD CONSTRAINT "hole_scores_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hole_scores" ADD CONSTRAINT "hole_scores_holeId_fkey" FOREIGN KEY ("holeId") REFERENCES "holes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hole_scores" ADD CONSTRAINT "hole_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
