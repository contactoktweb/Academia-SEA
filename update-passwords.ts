import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Actualizando contraseñas...")
  const defaultPassword = await bcrypt.hash("Password123!", 10)

  await prisma.user.updateMany({
    data: {
      password: defaultPassword
    }
  })

  console.log("Todas las contraseñas han sido actualizadas a Password123!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
