import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/transaction"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const query: Record<string, unknown> = { userId }

    if (type && (type === "income" || type === "expense")) {
      query.type = type
    }

    if (from || to) {
      query.date = {}
      if (from) (query.date as Record<string, unknown>).$gte = new Date(from)
      if (to) (query.date as Record<string, unknown>).$lte = new Date(to)
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }).lean()
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("GET /api/transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectToDatabase()

    const body = await req.json()
    const { type, amount, description, category, date } = body

    if (!type || !amount || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transaction = await Transaction.create({
      userId,
      type,
      amount: Number(amount),
      description,
      category,
      date: date ? new Date(date) : new Date(),
      uuid: crypto.randomUUID(),
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("POST /api/transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
