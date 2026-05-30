import { prisma } from "../../src/lib/prisma"
import { readFileSync } from "fs"
import { join } from "path"

interface HighlightData {
  id: string
  name: string
  imoveisId: string
  createdAt?: string
  updatedAt?: string
}

/* Carrega os dados do JSON externo */
const rawData = readFileSync(join(__dirname, "highlights-data.json"), "utf-8")
const highlights: HighlightData[] = JSON.parse(rawData)

const BATCH_SIZE = 50

export async function seedHighlights() {
  console.log(`🔄 Iniciando seed de highlights... (${highlights.length} registros)`)

  let inserted = 0

  for (let i = 0; i < highlights.length; i += BATCH_SIZE) {
    const batch = highlights.slice(i, i + BATCH_SIZE)

    const results = await Promise.all(
      batch.map((highlight) =>
        prisma.highlights.upsert({
          where: { id: highlight.id },
          update: {
            name: highlight.name,
            imoveisId: highlight.imoveisId,
          },
          create: {
            id: highlight.id,
            name: highlight.name,
            imoveisId: highlight.imoveisId,
          },
        })
      )
    )

    inserted += results.length
    const progress = Math.min(
      100,
      Math.round(((i + batch.length) / highlights.length) * 100)
    )
    console.log(`   📦 Batch ${Math.floor(i / BATCH_SIZE) + 1} — ${progress}% concluído (${Math.min(i + BATCH_SIZE, highlights.length)}/${highlights.length})`)
  }

  console.log(`✅ ${highlights.length} highlights inseridos/atualizados com sucesso!`)
}
