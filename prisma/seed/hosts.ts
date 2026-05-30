const hosts = [
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c01",
    name: "Carlos Almeida",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c02",
    name: "Mariana Costa",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c03",
    name: "João Pereira",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c04",
    name: "Ana Beatriz",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c05",
    name: "Rafael Martins",
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c06",
    name: "Fernanda Lima",
    photo: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c07",
    name: "Lucas Ferreira",
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c08",
    name: "Juliana Rocha",
    photo: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c09",
    name: "Pedro Henrique",
    photo: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c10",
    name: "Camila Souza",
    photo: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c11",
    name: "Bruno Carvalho",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c12",
    name: "Larissa Mendes",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c13",
    name: "Gustavo Barbosa",
    photo: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c14",
    name: "Patrícia Gomes",
    photo: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c15",
    name: "Felipe Azevedo",
    photo: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c16",
    name: "Bianca Nascimento",
    photo: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c17",
    name: "André Ribeiro",
    photo: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c18",
    name: "Sofia Martins",
    photo: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c19",
    name: "Diego Oliveira",
    photo: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c20",
    name: "Isabela Teixeira",
    photo: "https://randomuser.me/api/portraits/women/20.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c21",
    name: "Thiago Moreira",
    photo: "https://randomuser.me/api/portraits/men/21.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c22",
    name: "Aline Castro",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c23",
    name: "Eduardo Ramos",
    photo: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c24",
    name: "Vanessa Duarte",
    photo: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c25",
    name: "Marcelo Freitas",
    photo: "https://randomuser.me/api/portraits/men/25.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c26",
    name: "Renata Lopes",
    photo: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c27",
    name: "Vinícius Cardoso",
    photo: "https://randomuser.me/api/portraits/men/27.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c28",
    name: "Tatiane Moraes",
    photo: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c29",
    name: "Leandro Batista",
    photo: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    id: "b8f4c1a2-9d3e-4a6b-8c7d-1f2e3a4b5c30",
    name: "Helena Farias",
    photo: "https://randomuser.me/api/portraits/women/30.jpg",
  },
]

import { prisma } from '../../src/lib/prisma'

export async function seedHosts() {
  for (let i = 0; i < hosts.length; i++) {
    await prisma.host.upsert({
      where: { id: hosts[i].id },
      update: {
        name: hosts[i].name,
        photo: hosts[i].photo,
      },
      create: {
        id: hosts[i].id,
        name: hosts[i].name,
        photo: hosts[i].photo,
      },
    })
  }

  console.log(`✅ ${hosts.length} hosts inseridos com sucesso!`)
}

