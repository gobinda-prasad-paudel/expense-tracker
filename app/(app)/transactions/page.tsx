"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { useUser } from "@clerk/nextjs"
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getDateRange(preset: string): { from: string; to: string } {
  const to = new Date()
  const from = new Date()

  switch (preset) {
    case "1m":
      from.setMonth(from.getMonth() - 1)
      break
    case "2m":
      from.setMonth(from.getMonth() - 2)
      break
    case "3m":
      from.setMonth(from.getMonth() - 3)
      break
    case "6m":
      from.setMonth(from.getMonth() - 6)
      break
    case "1y":
      from.setFullYear(from.getFullYear() - 1)
      break
    default:
      from.setMonth(from.getMonth() - 1)
  }

  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  }
}

interface Transaction {
  _id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export default function TransactionsPage() {
  const { user } = useUser()
  const [preset, setPreset] = useState("1m")
  const [filterType, setFilterType] = useState("all")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  const dateRange = useMemo(() => {
    if (preset === "custom") {
      return { from: customFrom, to: customTo }
    }
    return getDateRange(preset)
  }, [preset, customFrom, customTo])

  const queryParams = new URLSearchParams()
  if (dateRange.from) queryParams.set("from", dateRange.from)
  if (dateRange.to) queryParams.set("to", dateRange.to)
  if (filterType !== "all") queryParams.set("type", filterType)

  const { data, isLoading } = useSWR(
    `/api/transactions?${queryParams.toString()}`,
    fetcher
  )

  const transactions: Transaction[] = Array.isArray(data) ? data : []

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  async function downloadPDF() {
    try {
      const jsPDFModule = await import("jspdf")
      const jsPDF = jsPDFModule.default
      await import("jspdf-autotable")

      const doc = new jsPDF({ orientation: "portrait" })
      const userName = user?.fullName ?? "User"
      const fromDate = dateRange.from || "N/A"
      const toDate = dateRange.to || "N/A"

      // Header
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("Expense Tracker App: https://expensetrack4.netlify.app/", 14, 20)

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Electronic Statement", 14, 30)
      doc.text(`From ${fromDate} to ${toDate}`, doc.internal.pageSize.width - 14, 30, { align: "right" })

      doc.text(`Name: ${userName}`, 14, 40)

      // Calculate opening and closing balance
      let runningBalance = 0
      const sortedTxns = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      const openingBalance = 0
      let closingBalance = 0
      for (const t of sortedTxns) {
        if (t.type === "income") closingBalance += t.amount
        else closingBalance -= t.amount
      }

      doc.text(
        `Opening Balance: ${formatNPR(openingBalance)}`,
        doc.internal.pageSize.width - 14,
        40,
        { align: "right" }
      )

      doc.text("Currency: NPR", 14, 48)
      doc.text(
        `Closing Balance: ${formatNPR(closingBalance)}`,
        doc.internal.pageSize.width - 14,
        48,
        { align: "right" }
      )

      doc.setDrawColor(200)
      doc.line(14, 54, doc.internal.pageSize.width - 14, 54)

      // Table
      runningBalance = 0
      const tableData = sortedTxns.map((t) => {
        const isIncome = t.type === "income"
        if (isIncome) runningBalance += t.amount
        else runningBalance -= t.amount

        return [
          new Date(t.date).toLocaleDateString(),
          t.description,
          isIncome ? "" : `${formatNPR(t.amount)}`,
          isIncome ? `${formatNPR(t.amount)}` : "",
          formatNPR(runningBalance),
        ]
      })

      ;(doc as unknown as Record<string, CallableFunction>).autoTable({
        startY: 60,
        head: [["TXN Date", "Description", "Withdraw (Expense)", "Deposit (Income)", "Total Balance"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [14, 165, 233],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [50, 50, 50],
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 45, halign: "right" },
          3: { cellWidth: 45, halign: "right" },
          4: { cellWidth: 45, halign: "right" },
        },
        margin: { left: 14, right: 14 },
      })

      // Summary row
      const finalY = (doc as unknown as Record<string, number>).lastAutoTable?.finalY ?? 200
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(`Total Income: ${formatNPR(totalIncome)}`, 14, finalY + 12)
      doc.text(`Total Expense: ${formatNPR(totalExpense)}`, 14, finalY + 20)
      doc.text(`Net Balance: ${formatNPR(closingBalance)}`, 14, finalY + 28)

      doc.save(`expense-tracker-statement-${fromDate}-to-${toDate}.pdf`)
      toast.success("PDF downloaded successfully")
    } catch (error) {
      console.error("PDF generation error:", error)
      toast.error("Failed to generate PDF")
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            View and download your transaction history
          </p>
        </div>
        <Button
          size="sm"
          onClick={downloadPDF}
          disabled={transactions.length === 0}
          className="gap-1"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Filters */}
      <Card className="mt-6 border-border/50 bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1 text-foreground">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <Select value={preset} onValueChange={setPreset}>
                <SelectTrigger className="w-44 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="1m">Last 1 Month</SelectItem>
                  <SelectItem value="2m">Last 2 Months</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last 1 Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {preset === "custom" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">From</Label>
                  <Input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">To</Label>
                  <Input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1 text-foreground">
                <Filter className="h-4 w-4" />
                Type
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expense Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <p className="text-xs text-muted-foreground">Period Income</p>
          <p className="mt-1 text-lg font-bold text-success">{formatNPR(totalIncome)}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <p className="text-xs text-muted-foreground">Period Expense</p>
          <p className="mt-1 text-lg font-bold text-destructive">{formatNPR(totalExpense)}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <p className="text-xs text-muted-foreground">Net Balance</p>
          <p className="mt-1 text-lg font-bold text-primary">{formatNPR(totalIncome - totalExpense)}</p>
        </div>
      </div>

      {/* Transaction List */}
      <Card className="mt-4 border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">
            Transactions ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No transactions found for the selected period.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((t) => (
                <div
                  key={t._id}
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
                      <p className="text-sm font-medium text-foreground">
                        {t.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.category} &middot;{" "}
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      t.type === "income" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} {formatNPR(t.amount)}
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
