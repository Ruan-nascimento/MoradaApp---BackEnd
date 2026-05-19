const reservas = [
  {
    "nome": "Quarto Standard - Hotel Mar Azul",
    "data": "2026-05-20",
    "hora": "14:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Suíte Luxo - Pousada Sol Nascente",
    "data": "2026-05-21",
    "hora": "15:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Casal - Hotel Central",
    "data": "2026-05-22",
    "hora": "13:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Apartamento Família - Flat Boa Vista",
    "data": "2026-05-23",
    "hora": "16:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Suíte Master - Resort Praia Bela",
    "data": "2026-05-24",
    "hora": "14:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Individual - Hotel Executivo",
    "data": "2026-05-25",
    "hora": "12:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Chalé Romântico - Pousada Recanto Verde",
    "data": "2026-05-26",
    "hora": "17:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Duplo - Hotel Aeroporto",
    "data": "2026-05-27",
    "hora": "11:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Suíte com Varanda - Hotel Vista Mar",
    "data": "2026-05-28",
    "hora": "15:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Cabana Premium - Eco Lodge Serra Alta",
    "data": "2026-05-29",
    "hora": "14:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Econômico - Hostel Caminho Livre",
    "data": "2026-05-30",
    "hora": "13:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Suíte Presidencial - Grand Hotel Palace",
    "data": "2026-05-31",
    "hora": "18:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Triplo - Pousada Família Feliz",
    "data": "2026-06-01",
    "hora": "14:45",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Bangalô Frente Mar - Resort Costa Dourada",
    "data": "2026-06-02",
    "hora": "16:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Executivo - Hotel Business Prime",
    "data": "2026-06-03",
    "hora": "12:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Loft Moderno - Stay Urban Residence",
    "data": "2026-06-04",
    "hora": "15:15",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Suíte com Hidromassagem - Pousada Lua Cheia",
    "data": "2026-06-05",
    "hora": "19:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Compacto - Hotel Rota Norte",
    "data": "2026-06-06",
    "hora": "10:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Apartamento Premium - Residence Bela Vista",
    "data": "2026-06-07",
    "hora": "14:20",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Casal Deluxe - Hotel Jardim Tropical",
    "data": "2026-06-08",
    "hora": "13:50",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Suíte Família - Pousada Caminho do Sol",
    "data": "2026-06-09",
    "hora": "16:10",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Vista Piscina - Resort Águas Claras",
    "data": "2026-06-10",
    "hora": "15:40",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Studio Completo - Smart Stay Apartments",
    "data": "2026-06-11",
    "hora": "11:00",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Chalé Familiar - Pousada Vale Encantado",
    "data": "2026-06-12",
    "hora": "17:30",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  },
  {
    "nome": "Quarto Premium - Hotel Atlântico Sul",
    "data": "2026-06-13",
    "hora": "14:10",
    "userId": "c1231719-c225-494b-b849-02f1e2917071"
  }
]

import { prisma } from '../../src/lib/prisma'

async function main() {
    for (let i = 0; i < reservas.length; i++) {
        await prisma.reservas.create({
            data: {
                nome: reservas[i].nome,
                data: reservas[i].data,
                hora: reservas[i].hora,
                userId: reservas[i].userId
            }
        })
    }
}

main()
    .catch((e) => {
        console.error("Erro ao rodar seed:", e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())