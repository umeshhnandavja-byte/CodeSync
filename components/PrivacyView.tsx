import { Database, EyeOff, Server, HardDrive, ShieldCheck } from "lucide-react"

export function PrivacyView() {
  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      content:
        "CodeSync is designed to operate with minimal data footprint. We do not require account creation, email addresses, or passwords. We only collect the public usernames you provide (e.g., LeetCode, Codeforces) to fetch publicly available competitive programming statistics.",
    },
    {
      icon: HardDrive,
      title: "2. Local Storage & Cookies",
      content:
        "We do not use tracking cookies. CodeSync relies entirely on your browser's local storage (localStorage) to save your active session state. This includes your daily streaks, custom problem checklists, and target milestones. This data remains on your device and is never uploaded to our servers.",
    },
    {
      icon: Server,
      title: "3. Third-Party AI Processing",
      content:
        "To power the AI Architect, the text prompts you enter and the contents of any files you explicitly upload are securely transmitted to our third-party inference provider (Groq). This data is processed in real-time to generate your custom problem roadmaps and is not retained by us or used to train public AI models.",
    },
    {
      icon: EyeOff,
      title: "4. Analytics & Hosting Data",
      content:
        "CodeSync is hosted on modern edge infrastructure. Our hosting providers may automatically log standard, anonymized connection data (such as IP addresses, browser types, and timestamp data) for security, debugging, and rate-limiting purposes.",
    },
    {
      icon: ShieldCheck,
      title: "5. Your Rights & Data Control",
      content:
        "Because your profile data and progress are stored locally on your machine, you have full control over your data. You can permanently delete all CodeSync data at any time by clearing your browser's cache and local storage.",
    },
  ]

  return (
    <>
      <header className="border-b border-border/60 px-6 py-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Legal / Data</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          We build tools for developers, which means we respect your data. Here is exactly what we fetch, where it goes, and how it is stored.
        </p>
      </header>

      <main className="mx-auto max-w-[1500px] p-6 lg:p-10">
        <div className="flex flex-col gap-6 max-w-4xl">
          {sections.map(({ icon: Icon, title, content }) => (
            <section
              key={title}
              className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed md:pl-12">{content}</p>
            </section>
          ))}
        </div>

        <footer className="mt-10 max-w-4xl rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            Effective Date: August 2026 · Built by Kernel Berserker
          </p>
        </footer>
      </main>
    </>
  )
}