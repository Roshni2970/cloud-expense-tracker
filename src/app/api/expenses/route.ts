import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, amount, currency, date, categoryId, notes, userId } = body

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        currency,
        date: new Date(date),
        categoryId,
        notes,
        userId,
        status: "PENDING"
      }
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Failed to create expense:", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
