/*
  Warnings:

  - You are about to drop the `reservas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_userId_fkey";

-- DropTable
DROP TABLE "reservas";

-- CreateTable
CREATE TABLE "Reservas" (
    "id" TEXT NOT NULL,
    "imoveisId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chekIn" TIMESTAMP(3) NOT NULL,
    "chekOut" TIMESTAMP(3) NOT NULL,
    "finalValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favoritos" (
    "id" TEXT NOT NULL,
    "imoveisId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imoveis" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "imoveisId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" VARCHAR(250) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlights" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imoveisId" TEXT NOT NULL,

    CONSTRAINT "Highlights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_imoveisId_fkey" FOREIGN KEY ("imoveisId") REFERENCES "Imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoritos" ADD CONSTRAINT "Favoritos_imoveisId_fkey" FOREIGN KEY ("imoveisId") REFERENCES "Imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoritos" ADD CONSTRAINT "Favoritos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imoveis" ADD CONSTRAINT "Imoveis_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_imoveisId_fkey" FOREIGN KEY ("imoveisId") REFERENCES "Imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlights" ADD CONSTRAINT "Highlights_imoveisId_fkey" FOREIGN KEY ("imoveisId") REFERENCES "Imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
