import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/transaction"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDatabase()

    const transactions = await Transaction.find({ userId }).lean()

    let totalIncome = 0
    let totalExpense = 0

    for (const t of transactions) {
      if (t.type === "income") totalIncome += t.amount
      else totalExpense += t.amount
    }

    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean()

    return NextResponse.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      recentTransactions,
    })
  } catch (error) {
    console.error("GET /api/transactions/summary error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
