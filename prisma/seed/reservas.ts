import { prisma } from '../../src/lib/prisma'

export async function seedReservas() {
  console.log('🔄 Iniciando seed de reservas...')

  // Garante que o usuário de teste existe
  const testUser = await prisma.usuario.upsert({
    where: { email: 'ruan@teste.com' },
    update: {},
    create: {
      id: 'c1231719-c225-494b-b849-02f1e2917071',
      email: 'ruan@teste.com',
      name: 'Ruan Nascimento',
      password: 'password123', // Em produção deve ser hash, mas para seed simplifica
    },
  })

  // Pega alguns imóveis criados no seed anterior
  const imoveis = await prisma.imoveis.findMany({ take: 5 })

  if (imoveis.length === 0) {
    console.log('⚠️ Nenhum imóvel encontrado para criar reservas.')
    return
  }

  // Deleta as reservas antigas para não duplicar no reset
  await prisma.reservas.deleteMany({
    where: {
      userId: testUser.id,
    },
  })

  const datas = [
    { checkIn: new Date('2026-06-01T12:00:00Z'), checkOut: new Date('2026-06-05T12:00:00Z') },
    { checkIn: new Date('2026-06-10T12:00:00Z'), checkOut: new Date('2026-06-15T12:00:00Z') },
    { checkIn: new Date('2026-06-20T12:00:00Z'), checkOut: new Date('2026-06-22T12:00:00Z') },
  ]

  for (let i = 0; i < Math.min(imoveis.length, datas.length); i++) {
    const imovel = imoveis[i]
    const periodo = datas[i]
    const dias = Math.ceil((periodo.checkOut.getTime() - periodo.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const finalValue = imovel.price * dias

    await prisma.reservas.create({
      data: {
        imoveisId: imovel.id,
        userId: testUser.id,
        chekIn: periodo.checkIn,
        chekOut: periodo.checkOut,
        finalValue: finalValue,
      },
    })
  }

  console.log('✅ Reservas de teste inseridas com sucesso!')
}