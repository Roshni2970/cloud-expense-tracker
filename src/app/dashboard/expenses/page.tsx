import { PrismaClient } from "@prisma/client"
import { ExpenseTable } from "@/components/tables/ExpenseTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    include: {
      category: true,
      user: true,
    },
    orderBy: {
      date: 'desc'
    }
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
        <Link href="/dashboard/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border">
        <ExpenseTable expenses={expenses} />
      </div>
    </div>
  )
}
