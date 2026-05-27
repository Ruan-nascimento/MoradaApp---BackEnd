import { prisma } from "../../src/lib/prisma"
import { readFileSync } from "fs"
import { join } from "path"

interface ReviewData {
  id: string
  imoveisId: string
  createdAt: string
  updatedAt: string
  imgUser: string
  name: string
  stars: number
  comment: string
}

/* Carrega os dados do JSON externo (evita poluir o script com 17k+ linhas) */
const rawData = readFileSync(join(__dirname, "reviews-data.json"), "utf-8")
const reviews: ReviewData[] = JSON.parse(rawData)

const BATCH_SIZE = 50

async function main() {
  console.log(`🔄 Iniciando seed de reviews... (${reviews.length} registros)`)

  let inserted = 0
  let updated = 0

  for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
    const batch = reviews.slice(i, i + BATCH_SIZE)

    const results = await Promise.all(
      batch.map((review) =>
        prisma.reviews.upsert({
          where: { id: review.id },
          update: {
            imoveisId: review.imoveisId,
            imgUser: review.imgUser,
            name: review.name,
            stars: review.stars,
            comment: review.comment,
          },
          create: {
            id: review.id,
            imoveisId: review.imoveisId,
            imgUser: review.imgUser,
            name: review.name,
            stars: review.stars,
            comment: review.comment,
          },
        })
      )
    )

    inserted += results.length
    const progress = Math.min(
      100,
      Math.round(((i + batch.length) / reviews.length) * 100)
    )
    console.log(`   📦 Batch ${Math.floor(i / BATCH_SIZE) + 1} — ${progress}% concluído (${Math.min(i + BATCH_SIZE, reviews.length)}/${reviews.length})`)
  }

  console.log(`✅ ${reviews.length} reviews inseridos/atualizados com sucesso!`)
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed de reviews:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())