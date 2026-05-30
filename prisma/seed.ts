import { prisma } from '../src/lib/prisma'
import { seedHosts } from './seed/hosts'
import { seedImoveis } from './seed/imoveis'
import { seedHighlights } from './seed/highlights'
import { seedReviews } from './seed/reviews'
import { seedReservas } from './seed/reservas'

async function main() {
  console.log('🌱 Iniciando a execução de todos os seeds...')

  // 1. Hosts (tabela independente)
  await seedHosts()

  // 2. Imóveis (depende de Host)
  await seedImoveis()

  // 3. Highlights (depende de Imóveis)
  await seedHighlights()

  // 4. Reviews (depende de Imóveis)
  await seedReviews()

  // 5. Reservas (depende de Imóveis e Usuários)
  await seedReservas()

  console.log('🌱 Todos os seeds executados com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução dos seeds:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
