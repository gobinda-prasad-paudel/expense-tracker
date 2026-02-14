"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const incomeCategories = ["Salary", "Freelance", "Investment", "Business", "Rental", "Other"]
const expenseCategories = ["Food", "Transport", "Housing", "Utilities", "Entertainment", "Health", "Education", "Shopping", "Other"]

interface TransactionDialogProps {
  type: "income" | "expense"
  trigger: React.ReactNode
  onSuccess?: () => void
  editData?: {
    _id: string
    amount: number
    description: string
    category: string
    date: string
  }
}

export function TransactionDialog({ type, trigger, onSuccess, editData }: TransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(editData?.amount?.toString() ?? "")
  const [description, setDescription] = useState(editData?.description ?? "")
  const [category, setCategory] = useState(editData?.category ?? "")
  const [date, setDate] = useState(
    editData?.date ? new Date(editData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  )

  const categories = type === "income" ? incomeCategories : expenseCategories
  const isEdit = !!editData

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !description || !category) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const url = isEdit ? `/api/transactions/${editData._id}` : "/api/transactions"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount: Number(amount), description, category, date }),
      })

      if (!res.ok) throw new Error("Failed to save transaction")

      toast.success(isEdit ? "Transaction updated" : `${type === "income" ? "Income" : "Expense"} added`)
      setOpen(false)

      if (!isEdit) {
        setAmount("")
        setDescription("")
        setCategory("")
        setDate(new Date().toISOString().split("T")[0])
      }

      onSuccess?.()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEdit ? "Edit" : "Add"} {type === "income" ? "Income" : "Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount" className="text-foreground">Amount (NPR)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Saving..." : isEdit ? "Update" : "Add"} {type === "income" ? "Income" : "Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
