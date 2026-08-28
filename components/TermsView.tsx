import { ShieldCheck, Lock, Scale, AlertCircle, Cpu, Database } from "lucide-react"

export function TermsView() {
  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using CodeSync, you agree to these terms. CodeSync is an experimental, actively developed competitive programming dashboard designed to track consistency and automate roadmap generation.",
    },
    {
      icon: Database,
      title: "2. Public Profile Data & Integrations",
      content:
        "CodeSync fetches public profile data, contest ratings, and submission counts from third-party competitive programming platforms (such as LeetCode and Codeforces). We do not collect, require, or store your passwords or private credentials.",
    },
    {
      icon: Cpu,
      title: "3. AI Processing & Data Transmission",
      content:
        "When using the AI Architect feature, your prompts and uploaded files are transmitted to external AI inference providers (such as Groq) strictly to generate your checklist. Prompts are processed ephemerally and are not used to train proprietary public models.",
    },
    {
      icon: Lock,
      title: "4. Client-Side Storage",
      content:
        "Your solved checklist progress, custom target goals, and preferences are stored directly on your browser via localStorage. Clearing your browser cache will reset your local progress unless backed up manually.",
    },
    {
      icon: AlertCircle,
      title: "5. Fair Use & API Limits",
      content:
        "Users must not abuse the AI roadmap generator with automated scripts, excessive spam requests, or unauthorized scraping. We reserve the right to throttle or restrict access to preserve server bandwidth.",
    },
    {
      icon: ShieldCheck,
      title: "6. Disclaimer of Warranties",
      content:
        "CodeSync is provided on an 'as is' and 'as available' basis without warranties of any kind. We are not officially affiliated with LeetCode, Codeforces, or any referenced third-party platforms.",
    },
  ]

  return (
    <>
      <header className="border-b border-border/60 px-6 py-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Legal / Governance</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Terms & Privacy Policy</h1>
      </header>

      <main className="mx-auto max-w-[1500px] p-6 lg:p-10">
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, content }) => (
            <section
              key={title}
              className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-md transition-all duration-200 hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <h2 className="text-base font-semibold">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-12">{content}</p>
            </section>
          ))}
        </div>

        <footer className="mt-8 rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            Last updated: August 2026 · CodeSync Competitive OS
          </p>
        </footer>
      </main>
    </>
  )
}