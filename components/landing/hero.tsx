import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Smart Financial Tracking</span>
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Take Control of Your{" "}
          <span className="text-primary">Finances</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Track every expense and income with ease. Get clear insights into your spending habits
          and make smarter financial decisions.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 text-base">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-base">
              Learn More
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-10">
          <div>
            <p className="text-2xl font-bold text-foreground md:text-3xl">100%</p>
            <p className="mt-1 text-sm text-muted-foreground">Free to Use</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground md:text-3xl">PDF</p>
            <p className="mt-1 text-sm text-muted-foreground">Export Reports</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground md:text-3xl">NPR</p>
            <p className="mt-1 text-sm text-muted-foreground">Currency Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
