import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.task.create({
    data: {
      title: 'Finish project proposal',
    },
  })

  await prisma.task.create({
    data: {
      title: 'Buy groceries',
      completed: true,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Schedule dentist appointment',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

