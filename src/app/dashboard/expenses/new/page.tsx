import { PrismaClient } from "@prisma/client"
import { ExpenseForm } from "@/components/forms/ExpenseForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export default async function NewExpensePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Add New Expense</h2>
      <ExpenseForm categories={categories} userId={(session.user as any).id} />
    </div>
  )
}
