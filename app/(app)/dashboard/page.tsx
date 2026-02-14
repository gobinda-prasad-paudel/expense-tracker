"use client"

import useSWR from "swr"
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionDialog } from "@/components/app/transaction-dialog"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function DashboardPage() {
  const { data, isLoading, mutate } = useSWR("/api/transactions/summary", fetcher)

  const totalIncome = data?.totalIncome ?? 0
  const totalExpense = data?.totalExpense ?? 0
  const balance = data?.balance ?? 0
  const recentTransactions = data?.recentTransactions ?? []

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your finances</p>
        </div>
        <div className="flex gap-2">
          <TransactionDialog
            type="income"
            trigger={
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Income
              </Button>
            }
            onSuccess={() => mutate()}
          />
          <TransactionDialog
            type="expense"
            trigger={
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            }
            onSuccess={() => mutate()}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {isLoading ? "..." : formatNPR(totalIncome)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expense</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {isLoading ? "..." : formatNPR(totalExpense)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {isLoading ? "..." : formatNPR(balance)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet. Add your first income or expense above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentTransactions.map((t: Record<string, unknown>) => (
                <div
                  key={t._id as string}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        t.type === "income" ? "bg-success/10" : "bg-destructive/10"
                      }`}
                    >
                      {t.type === "income" ? (
                        <ArrowUpRight className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.description as string}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category as string} &middot; {new Date(t.date as string).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      t.type === "income" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} {formatNPR(t.amount as number)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
