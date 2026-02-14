import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileText,
  Shield,
  BarChart3,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Wallet,
    title: "Dashboard Overview",
    description:
      "Get a clear snapshot of your total income, expenses, and balance at a glance.",
  },
  {
    icon: TrendingUp,
    title: "Income Tracking",
    description:
      "Record and categorize all your income sources with ease.",
  },
  {
    icon: TrendingDown,
    title: "Expense Management",
    description:
      "Track every expense, edit or delete entries anytime you need to.",
  },
  {
    icon: FileText,
    title: "PDF Statements",
    description:
      "Download professional PDF statements of your transactions for any date range.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Your data is protected with Clerk authentication and secure sessions.",
  },
  {
    icon: BarChart3,
    title: "Date Range Filters",
    description:
      "Filter transactions by custom or preset date ranges like 1, 3, 6, or 12 months.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Everything You Need to Manage Money
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            A complete suite of tools designed to help you track, analyze, and
            optimize your personal finances.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
