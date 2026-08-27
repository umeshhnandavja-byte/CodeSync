"use client"

import { useMemo, useState, useEffect } from "react"
import { Activity, BarChart3, Bot, Check, CheckSquare2, ChevronDown, ChevronLeft, ChevronRight, Code2, ExternalLink, Filter, MessageSquare, Play, Search, Send, Settings, Sparkles, Trash2, X } from "lucide-react"
import { Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsView } from "@/components/settings-view"
import { AiChatModal } from "@/components/ai-chat-modal"

type View = "Dashboard" | "Master Checklist" | "Analytics" | "Settings"
const navItems = [{ label: "Dashboard", icon: BarChart3 }, { label: "Master Checklist", icon: CheckSquare2 }, { label: "Analytics", icon: Activity }, { label: "Settings", icon: Settings }]

const difficultyColors = { Easy: "#51d88a", Medium: "#f5a94f", Hard: "#f16f6f" }

function DashboardCard({ children, className }: { children: React.ReactNode; className?: string }) { return <section className={cn("rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/80", className)}>{children}</section> }
function CardHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) { return <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p><h2 className="mt-2 text-base font-medium">{title}</h2></div>{action}</div> }

function DashboardPage({ onOpenAi }: { onOpenAi: () => void }) { 
  const [stats, setStats] = useState<any>(null);
  const [cfStats, setCfStats] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>("NA");
  const [weeklyTarget, setWeeklyTarget] = useState(15);
  const [monthlyTarget, setMonthlyTarget] = useState(50);
  const [monthStartTotal, setMonthStartTotal] = useState<number>(0);
  const [isEditingMilestones, setIsEditingMilestones] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("codesync_display_name");
    if (savedName) setDisplayName(savedName.split(" ")[0]);
  }, []);

  useEffect(() => {
    const savedWT = localStorage.getItem("codesync_weekly_target");
    const savedMT = localStorage.getItem("codesync_monthly_target");
    if (savedWT) setWeeklyTarget(Number(savedWT));
    if (savedMT) setMonthlyTarget(Number(savedMT));

    const savedLc = localStorage.getItem("leetcode_username") || "tourist";
    fetch(`/api/leetcode?username=${savedLc}`)
      .then((res) => res.json())
      .then((data) => { if (data.ok) setStats(data.data); })
      .catch((err) => console.error("Failed to load leetcode stats", err));

    const savedCf = localStorage.getItem("codeforces_handle") || "tourist";
    fetch(`/api/codeforces?handle=${savedCf}`)
      .then((res) => res.json())
      .then((data) => { if (data.ok) setCfStats(data.data); })
      .catch((err) => console.error("Failed to load codeforces stats", err));
  }, []);

  const totalSolved = stats?.totalSolved ?? 0;
  const cfSolved = cfStats?.totalSolved ?? 0;
  const combinedTotal = (typeof totalSolved === "number" ? totalSolved : 0) + (typeof cfSolved === "number" ? cfSolved : 0);

  useEffect(() => {
    if (combinedTotal > 0) {
      const currentMonthKey = `codesync_start_total_${new Date().getFullYear()}_${new Date().getMonth()}`;
      const savedStartTotal = localStorage.getItem(currentMonthKey);
      if (savedStartTotal) {
        setMonthStartTotal(Number(savedStartTotal));
      } else {
        localStorage.setItem(currentMonthKey, combinedTotal.toString());
        setMonthStartTotal(combinedTotal);
      }
    }
  }, [combinedTotal]);

  const saveTargets = (wt: number, mt: number) => {
    setWeeklyTarget(wt);
    setMonthlyTarget(mt);
    localStorage.setItem("codesync_weekly_target", wt.toString());
    localStorage.setItem("codesync_monthly_target", mt.toString());
  };

  const globalRanking = stats?.globalRanking ? stats.globalRanking.toLocaleString() : "Loading...";
  const easySolved = stats?.difficulty?.easy ?? "...";
  const mediumSolved = stats?.difficulty?.medium ?? "...";
  const hardSolved = stats?.difficulty?.hard ?? "...";
  const currentStreak = stats?.streak ?? 0; 
  const cfRating = cfStats?.rating ?? "N/A";
  const cfMaxRating = cfStats?.maxRating ?? "N/A";
  const cfRank = cfStats?.rank ?? "Unranked";
  const monthlyCurrent = Math.max(0, combinedTotal - monthStartTotal);
  const weeklyCurrent = Math.min(weeklyTarget, Math.max(0, monthlyCurrent));

  const platforms = [
    { name: "LeetCode", solved: stats?.totalSolved ?? 0, total: 350, href: "https://leetcode.com/", color: "bg-chart-1" }, 
    { name: "Codeforces", solved: cfRating, total: 3000, href: "https://codeforces.com/", color: "bg-chart-3" }
  ];

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-border/60 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Thursday, August 27, 2026</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Good morning, {displayName}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your consistency is compounding. Keep the streak alive.</p>
        </div>
      </header>
      <main className="mx-auto grid max-w-[1500px] gap-5 p-6 lg:grid-cols-3 lg:p-10">
        <DashboardCard className="lg:col-span-2">
          <CardHeading eyebrow="Overview / 01" title="LeetCode profile" />
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Problems solved</p>
              <p className="mt-2 text-2xl font-semibold">{totalSolved}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">Easy: {easySolved} | Med: {mediumSolved} | Hard: {hardSolved}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily streak</p>
              <p className="mt-2 text-2xl font-semibold">{currentStreak} days</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">Live from calendar</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Global rating</p>
              <p className="mt-2 text-2xl font-semibold">{globalRanking}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">LeetCode rank</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex flex-col justify-between lg:col-span-1 lg:row-span-2">
          <div>
            <CardHeading eyebrow="Progress / 02" title="Platform breakdown" />
            <div className="mt-6 flex flex-col gap-5">
              {platforms.map((platform) => (
                <div key={platform.name}>
                  <div className="flex justify-between text-xs">
                    <span>{platform.name}</span>
                    <span className="font-mono text-muted-foreground">{platform.solved} {platform.name === "Codeforces" ? "rating" : `/ ${platform.total}`}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", platform.color)} style={{ width: platform.name === "Codeforces" ? `${Math.min(100, (Number(platform.solved) / 3000) * 100)}%` : `${Math.min(100, (platform.solved / platform.total) * 100)}%` }} />
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-3 h-8 w-full text-xs">
                    <a href={platform.href} target="_blank" rel="noreferrer">Open {platform.name}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-8" />
        </DashboardCard>

        <DashboardCard className="lg:col-span-2">
          <CardHeading eyebrow="Overview / Codeforces" title="Codeforces Profile" />
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Current rating</p>
              <p className="mt-2 text-2xl font-semibold">{cfRating}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">Max: {cfMaxRating}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Title rank</p>
              <p className="mt-2 text-xl font-semibold capitalize">{cfRank}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">Competitive tier</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Problems solved</p>
              <p className="mt-2 text-2xl font-semibold">{cfSolved}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">Unique ACs</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <CardHeading eyebrow="Momentum / 03" title="Milestones & consistency" />
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsEditingMilestones(!isEditingMilestones)}>
              {isEditingMilestones ? "Save Targets" : "Edit Targets"}
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-border/65 bg-muted/20 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Streak status</p>
                <p className="mt-2 text-xl font-semibold">{currentStreak > 0 ? "🔥 On Fire" : "⚠️ Needs Attention"}</p>
              </div>
              <p className="mt-4 font-mono text-[11px] text-muted-foreground">
                {currentStreak > 0 ? `${currentStreak} day streak active today.` : "Submit a problem today to lock in your streak!"}
              </p>
            </div>
            
            <div className="flex flex-col justify-between rounded-xl border border-border/65 bg-muted/20 p-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Weekly milestone</p>
                  <span className="font-mono text-[10px] text-primary">
                    {Math.min(100, Math.round((weeklyCurrent / weeklyTarget) * 100))}% done
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xl font-semibold">{weeklyCurrent} / {isEditingMilestones ? (
                    <input type="number" value={weeklyTarget} onChange={(e) => saveTargets(Number(e.target.value), monthlyTarget)} className="inline-block w-16 rounded border border-border bg-background px-2 py-0.5 text-lg outline-none" />
                  ) : `${weeklyTarget}`} Solved</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, Math.round((weeklyCurrent / weeklyTarget) * 100))}%` }} />
                </div>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">Rolling 7-day progress</p>
              </div>
            </div>
            
            <div className="flex flex-col justify-between rounded-xl border border-border/65 bg-muted/20 p-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Monthly milestone (This month)</p>
                  <span className="font-mono text-[10px] text-chart-2">
                    {Math.min(100, Math.round((monthlyCurrent / monthlyTarget) * 100))}% done
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xl font-semibold">{monthlyCurrent} / {isEditingMilestones ? (
                    <input type="number" value={monthlyTarget} onChange={(e) => saveTargets(weeklyTarget, Number(e.target.value))} className="inline-block w-16 rounded border border-border bg-background px-2 py-0.5 text-lg outline-none" />
                  ) : `${monthlyTarget}`} Solved</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-chart-2 transition-all duration-300" style={{ width: `${Math.min(100, Math.round((monthlyCurrent / monthlyTarget) * 100))}%` }} />
                </div>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">Ends August 31 · Auto-calculated</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </main>
    </>
  )
}

function ChecklistView({ problems, onDelete }: { problems: any[]; onDelete: (id: number) => void }) { 
  const [search, setSearch] = useState(""); 
  const [openId, setOpenId] = useState<number | null>(null); 
  const [solved, setSolved] = useState<number[]>([]); 
  const [isLoaded, setIsLoaded] = useState(false);

  const safeProblems = Array.isArray(problems) ? problems : [];

  useEffect(() => {
    try {
      const savedSolved = localStorage.getItem("codesync_solved_problems");
      if (savedSolved) setSolved(JSON.parse(savedSolved));
    } catch { /* ignore parse errors */ }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("codesync_solved_problems", JSON.stringify(solved));
    }
  }, [solved, isLoaded]);

  const filtered = useMemo(() => safeProblems.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())), [search, safeProblems]); 
  
  // Calculate dynamic percentages
  const solvedCount = safeProblems.filter((p) => solved.includes(p.id)).length;
  const progressPercentage = safeProblems.length === 0 ? 0 : Math.round((solvedCount / safeProblems.length) * 100);

  return (
    <>
      <header className="border-b border-border/60 px-6 py-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Workspace / checklist</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">AI Master Checklist</h1>
      </header>
      
      <div className="mx-auto max-w-[1500px] p-6 lg:p-10">
        <DashboardCard>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* 🔥 FIXED: Graph now visually updates based on the exact percentage */}
            <div 
              className="flex size-32 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-in-out" 
              style={{ background: `conic-gradient(var(--chart-2) 0 ${progressPercentage}%, var(--muted) ${progressPercentage}% 100%)` }}
            >
              <div className="flex size-24 flex-col items-center justify-center rounded-full bg-card text-center">
                <span className="text-xl font-semibold">{solvedCount}/{safeProblems.length}</span>
                <span className="text-[11px] text-muted-foreground">{progressPercentage}% solved</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custom AI Roadmap Progress</p>
              <div className="mt-4 flex gap-4 text-xs">
                <span className="text-chart-2">Total {safeProblems.length}</span>
                <span className="text-chart-3">Remaining {safeProblems.length - solvedCount}</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems..." className="h-10 w-full rounded-lg border border-border bg-card/50 pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        {safeProblems.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
            <Sparkles className="mb-4 size-8 text-muted-foreground" />
            <h3 className="text-lg font-medium">Your checklist is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Open the AI Architect in the sidebar to generate a custom DSA roadmap and it will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-card/50">
            {filtered.map((p) => (
              <div key={p.id} className="group border-b border-border/60 last:border-b-0">
                <div className="flex w-full items-center gap-3 p-3 sm:p-4 hover:bg-muted/40 transition-colors">
                  <input type="checkbox" checked={solved.includes(p.id)} onChange={(e) => { e.stopPropagation(); setSolved(e.target.checked ? [...solved, p.id] : solved.filter((id) => id !== p.id)) }} onClick={(e) => e.stopPropagation()} aria-label={`Mark ${p.name} solved`} className="size-4 shrink-0 rounded border-border" />
                  
                  <button onClick={() => setOpenId(openId === p.id ? null : p.id)} className="flex flex-1 items-center gap-3 text-left overflow-hidden">
                    <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                    <span className="shrink-0 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] sm:text-[11px] text-muted-foreground hidden sm:flex">{p.topic}</span>
                    <span className="shrink-0 text-[10px] sm:text-xs font-mono text-muted-foreground">{p.difficulty}</span>
                    <ChevronDown className={cn("shrink-0 size-4 text-muted-foreground transition-transform", openId === p.id && "rotate-180")} />
                  </button>

                  <button 
                    onClick={() => onDelete(p.id)} 
                    className="shrink-0 rounded p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete problem"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                
                {openId === p.id && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-muted/10 px-4 sm:px-[52px] pb-4 pt-1">
                    <Button size="sm" variant="secondary" className="h-8 text-xs font-medium" onClick={() => alert("Socratic hint: Analyze the constraints and data types.")}>
                      <Sparkles className="size-3.5 mr-1.5 text-primary" /> AI Hint
                    </Button>
                    
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-medium">
                          <ExternalLink className="size-3.5 mr-1.5" /> Open Problem
                        </Button>
                      </a>
                    )}

                    <div className="flex flex-1 items-center gap-2 min-w-[200px] mt-1 sm:mt-0">
                      <input placeholder="Write a quick note..." className="h-8 w-full flex-1 rounded-md border border-border bg-background/50 px-3 text-xs outline-none focus:border-primary" />
                      <Button size="sm" variant="ghost" className="h-8 text-xs">Save</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  ) 
}

function AnalyticsPage({ problems }: { problems: any[] }) { 
    const [stats, setStats] = useState<any>(null);
    const [cfStats, setCfStats] = useState<any>(null);
    const safeProblems = Array.isArray(problems) ? problems : [];
  
    useEffect(() => {
      const savedLc = localStorage.getItem("leetcode_username") || "Umeshh_Nanda";
      fetch(`/api/leetcode?username=${savedLc}`)
        .then((res) => res.json())
        .then((data) => { if (data.ok) setStats(data.data); })
        .catch((err) => console.error("Failed to load leetcode stats", err));
  
      const savedCf = localStorage.getItem("codeforces_handle") || "tourist";
      fetch(`/api/codeforces?handle=${savedCf}`)
        .then((res) => res.json())
        .then((data) => { if (data.ok) setCfStats(data.data); })
        .catch((err) => console.error("Failed to load codeforces stats", err));
    }, []);
  
    const realRating = stats?.rating ?? 1500;
    const cfRatingVal = cfStats?.rating ?? 1530;
    const realSolvedCount = stats?.totalSolved ?? 48;
    const totalHours = ((realSolvedCount * 45) / 60).toFixed(1);
    const avgMinutes = realSolvedCount > 100 ? 32 : 42;
  
    const realDifficultyData = useMemo(() => {
      if (!stats?.difficulty) {
        return [
          { name: "Easy", value: 20, color: difficultyColors.Easy },
          { name: "Medium", value: 20, color: difficultyColors.Medium },
          { name: "Hard", value: 8, color: difficultyColors.Hard },
        ];
      }
      const { easy = 0, medium = 0, hard = 0 } = stats.difficulty;
      return [
        { name: "Easy", value: easy, color: difficultyColors.Easy },
        { name: "Medium", value: medium, color: difficultyColors.Medium },
        { name: "Hard", value: hard, color: difficultyColors.Hard },
      ];
    }, [stats]);
  
    return (
      <>
        <header className="flex flex-col gap-4 border-b border-border/60 px-6 py-6 sm:flex-row sm:items-end sm:justify-between lg:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Insights / analytics</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Analytics & Performance</h1>
          </div>
        </header>
  
        <main className="mx-auto grid max-w-[1500px] gap-5 p-6 lg:grid-cols-2 lg:p-10">
          <DashboardCard className="lg:col-span-2">
            <CardHeading eyebrow="Overview / Metrics" title="All-time profile summary" action={<span className="font-mono text-xs text-primary">Live Sync</span>} />
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border/65 bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Est. Practice Time</p>
                <p className="mt-2 text-2xl font-semibold">{totalHours} hrs</p>
              </div>
              <div className="rounded-xl border border-border/65 bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Avg. Solve Speed</p>
                <p className="mt-2 text-2xl font-semibold">{avgMinutes} mins</p>
              </div>
              <div className="rounded-xl border border-border/65 bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Live Platform Ratings</p>
                <p className="mt-2 text-xl font-semibold">LC: {realRating} | CF: {cfRatingVal}</p>
              </div>
              <div className="rounded-xl border border-border/65 bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Total Solved</p>
                <p className="mt-2 text-2xl font-semibold text-chart-2">{realSolvedCount} Problems</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <CardHeading eyebrow="Breakdown / 01" title="Solved difficulty distribution" />
            <div className="flex flex-col items-center gap-5 sm:flex-row mt-4">
              <ChartContainer config={{ easy: { label: "Easy", color: difficultyColors.Easy }, medium: { label: "Medium", color: difficultyColors.Medium }, hard: { label: "Hard", color: difficultyColors.Hard } }} className="h-[240px] min-w-0 w-full sm:w-1/2">
                <PieChart>
                  <Pie data={realDifficultyData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={4}>
                    {realDifficultyData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="grid w-full gap-3 sm:w-1/2">
                {realDifficultyData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: item.color }} />{item.name}</span>
                    <span className="font-mono text-muted-foreground">{item.value} solved</span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
  
          <DashboardCard>
            <CardHeading eyebrow="Recall / 02" title="AI revision queue" action={<Sparkles className="size-4 text-sidebar-primary" />} />
            <CardDescription className="mt-2">Problems close to the edge of your forgetting curve.</CardDescription>
            <div className="mt-5 flex flex-col gap-3">
              {safeProblems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Add problems from the AI Architect to see your revision queue.</p>
              ) : (
                safeProblems.slice(0, 4).map((problem, index) => (
                  <div key={problem.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/30 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{problem.name}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">Last attempted · Aug {12 + index * 3}, 2026</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </main>
      </>
    ) 
  }

export function DashboardShell({ children }: { children: (view: React.ReactNode) => React.ReactNode }) { 
  const [collapsed, setCollapsed] = useState(false); 
  const [aiChat, setAiChat] = useState(false); 
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ready to design your custom problem checklist. What should we build?" }]); 
  const [view, setView] = useState<View>("Dashboard"); 
  
  const [masterProblems, setMasterProblems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("codesync_ai_roadmap");
      if (saved) setMasterProblems(JSON.parse(saved) || []);
    } catch { /* ignore parse errors */ }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("codesync_ai_roadmap", JSON.stringify(masterProblems));
    }
  }, [masterProblems, isLoaded]);

  const handleAddFromAI = (newItems: any[]) => {
    const formattedItems = newItems.map((item, idx) => ({
      id: Date.now() + idx, 
      name: item.name,
      topic: item.category, 
      difficulty: item.difficulty,
      platform: item.platform,
      status: "Attempted",
      link: item.link || "" 
    }));
    
    setMasterProblems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, ...formattedItems];
    });
    
    setView("Master Checklist"); 
  };

  const handleDeleteProblem = (id: number) => {
    setMasterProblems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((p) => p.id !== id);
    });
  };

  const renderViewContent = () => {
    if (!isLoaded) return null;

    switch (view) {
      case "Dashboard": return <DashboardPage onOpenAi={() => setAiChat(true)} />;
      case "Master Checklist": return <ChecklistView problems={masterProblems} onDelete={handleDeleteProblem} />;
      case "Analytics": return <AnalyticsPage problems={masterProblems} />;
      case "Settings": return <SettingsView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={cn("fixed inset-y-0 left-0 z-20 flex flex-col border-r border-sidebar-border bg-sidebar/85 backdrop-blur-xl transition-[width] duration-300", collapsed ? "w-20" : "w-64")}>
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Code2 className="size-5" /></div>
          {!collapsed && <div><p className="font-mono text-sm font-semibold">CodeSync</p><p className="text-xs text-muted-foreground">Competitive OS</p></div>}
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-4" aria-label="Primary navigation">
          <p className={cn("mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", collapsed && "sr-only")}>Workspace</p>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} type="button" onClick={() => setView(label as View)} aria-current={view === label ? "page" : undefined} aria-label={label} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors hover:bg-sidebar-accent", view === label && "bg-sidebar-primary/10 text-sidebar-primary")}>
              <Icon className="size-4 shrink-0" />{!collapsed && <span>{label}</span>}{view === label && !collapsed && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
            </button>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <button type="button" onClick={() => setAiChat(true)} className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-3 text-left" aria-pressed={aiChat} aria-label="Toggle AI Chat">
            <span className="flex size-7 items-center justify-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary"><Sparkles className="size-3.5" /></span>
            {!collapsed && <><span className="flex-1 text-sm">AI Chat</span><span className={cn("size-2 rounded-full", aiChat ? "bg-chart-2" : "bg-muted-foreground")} /></>}
          </button>
        </div>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-24 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </button>
      </aside>
      
      <AiChatModal 
        open={aiChat} 
        onClose={() => setAiChat(false)} 
        messages={messages} 
        setMessages={setMessages} 
        onAddItems={handleAddFromAI}
        currentProblems={masterProblems}
      />

      <div className={cn("min-h-screen transition-[margin] duration-300", collapsed ? "ml-20" : "ml-64")}>
        {renderViewContent()}
      </div>
    </div>
  ) 
}

export function DashboardContent() { return <DashboardShell>{(content) => content}</DashboardShell> }
export default DashboardContent