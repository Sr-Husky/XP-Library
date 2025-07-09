/*
  Warnings:

  - You are about to drop the `XP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "XP" DROP CONSTRAINT "XP_id_user_fkey";

-- DropTable
DROP TABLE "XP";

-- CreateTable
CREATE TABLE "Xp" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "tags" TEXT[],
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mod" TIMESTAMP(3) NOT NULL,
    "pub" BOOLEAN NOT NULL,
    "likes" INTEGER NOT NULL,

    CONSTRAINT "Xp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Xp" ADD CONSTRAINT "Xp_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
