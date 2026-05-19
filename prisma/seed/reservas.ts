const reservas = [
    {
        nome: "Restaurante Sabor Nordestino",
        data: "2026-05-20",
        hora: "12:30",
        userId: "c1231719-c225-494b-b849-02f1e2917071",
    },
    {
        nome: "Clínica Vida Mais",
        data: "2026-05-21",
        hora: "09:00",
        userId: "c1231719-c225-494b-b849-02f1e2917071",
    },
    {
        nome: "Barbearia Estilo Fino",
        data: "2026-05-22",
        hora: "15:45",
        userId: "c1231719-c225-494b-b849-02f1e2917071",
    },
    {
        nome: "Academia Corpo Ativo",
        data: "2026-05-23",
        hora: "18:00",
        userId: "c1231719-c225-494b-b849-02f1e2917071",
    },
    {
        nome: "Café Central",
        data: "2026-05-24",
        hora: "10:15",
        userId: "c1231719-c225-494b-b849-02f1e2917071",
    },
];

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