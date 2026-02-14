import { Users, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            About This Project
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-border/50 bg-card">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Origin Story</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  This project was initially developed for tracking his own expenses by
                  the Lead Developer: <span className="font-medium text-foreground">Gobinda Prasad Paudel</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Voltanex</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  The same developer later completed the project fully under{" "}
                  <span className="font-semibold text-primary">Voltanex</span> &mdash; an e-club
                  open to electronics, computer science, and AI enthusiasts, dedicated to
                  collectively revolutionizing society through technology.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Website:{" "}
            <a
              href="https://gobindapoudel.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              gobindapoudel.com.np
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
