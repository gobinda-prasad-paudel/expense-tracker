import mongoose, { Schema, type Document } from "mongoose"

export interface ITransaction extends Document {
  userId: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: Date
  uuid: string
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    uuid: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

TransactionSchema.index({ userId: 1, date: -1 })
TransactionSchema.index({ userId: 1, type: 1 })

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema)
