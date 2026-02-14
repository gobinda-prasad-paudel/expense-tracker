"use client"

import useSWR from "swr"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TransactionDialog } from "@/components/app/transaction-dialog"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface TransactionListProps {
  type: "income" | "expense"
  title: string
}

export function TransactionList({ type, title }: TransactionListProps) {
  const { data, isLoading, mutate } = useSWR(`/api/transactions?type=${type}`, fetcher)

  const transactions = Array.isArray(data) ? data : []

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Transaction deleted")
      mutate()
    } catch {
      toast.error("Failed to delete transaction")
    }
  }

  const total = transactions.reduce((sum: number, t: Record<string, unknown>) => sum + (t.amount as number), 0)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {transactions.length} {transactions.length === 1 ? "record" : "records"} &middot; Total: {formatNPR(total)}
          </p>
        </div>
        <TransactionDialog
          type={type}
          trigger={
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add {type === "income" ? "Income" : "Expense"}
            </Button>
          }
          onSuccess={() => mutate()}
        />
      </div>

      <Card className="mt-6 border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">All {title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No {type === "income" ? "income" : "expense"} records yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((t: Record<string, unknown>) => (
                <div
                  key={t._id as string}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        type === "income" ? "bg-success/10" : "bg-destructive/10"
                      }`}
                    >
                      {type === "income" ? (
                        <ArrowUpRight className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.description as string}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category as string} &middot;{" "}
                        {new Date(t.date as string).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`mr-2 text-sm font-semibold ${
                        type === "income" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {formatNPR(t.amount as number)}
                    </p>
                    <TransactionDialog
                      type={type}
                      editData={{
                        _id: t._id as string,
                        amount: t.amount as number,
                        description: t.description as string,
                        category: t.category as string,
                        date: t.date as string,
                      }}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      }
                      onSuccess={() => mutate()}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">Delete Transaction</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(t._id as string)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
