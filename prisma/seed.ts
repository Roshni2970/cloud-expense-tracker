import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const employeePassword = await bcrypt.hash('employee123', 10)

  // Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: 'employee@example.com' },
    update: {},
    create: {
      email: 'employee@example.com',
      name: 'Test Employee',
      passwordHash: employeePassword,
      role: 'EMPLOYEE',
    },
  })

  // Seed Categories
  const softwareCat = await prisma.category.create({
    data: {
      name: 'Software Subscriptions',
      icon: 'Laptop',
      budgetLimit: 500,
    }
  })

  const travelCat = await prisma.category.create({
    data: {
      name: 'Travel & Meals',
      icon: 'Plane',
      budgetLimit: 1000,
    }
  })

  // Seed Expenses
  await prisma.expense.create({
    data: {
      title: 'GitHub Copilot',
      amount: 10,
      currency: 'USD',
      date: new Date(),
      categoryId: softwareCat.id,
      userId: employee.id,
      status: 'APPROVED',
      notes: 'Monthly subscription',
    }
  })

  await prisma.expense.create({
    data: {
      title: 'Client Lunch',
      amount: 45.50,
      currency: 'USD',
      date: new Date(),
      categoryId: travelCat.id,
      userId: employee.id,
      status: 'PENDING',
      notes: 'Lunch with Acme Corp',
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
