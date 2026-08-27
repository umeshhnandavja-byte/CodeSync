"use client"

import { useMemo, useState, useEffect } from "react"
import { Activity, BarChart3, Bot, Check, CheckSquare2, ChevronDown, ChevronLeft, ChevronRight, Code2, ExternalLink, Filter, MessageSquare, Play, Search, Send, Settings, Sparkles, X } from "lucide-react"
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
const problems = [{ id: 1, name: "Two Sum", topic: "Arrays", difficulty: "Easy", platform: "LeetCode", status: "Solved", video: "https://www.youtube.com/results?search_query=neetcode+two+sum" }, { id: 2, name: "Longest Substring Without Repeating Characters", topic: "Arrays", difficulty: "Medium", platform: "LeetCode", status: "Solved", video: "https://www.youtube.com/results?search_query=neetcode+longest+substring" }, { id: 3, name: "Number of Islands", topic: "Graphs", difficulty: "Medium", platform: "LeetCode", status: "Attempted", video: "https://www.youtube.com/results?search_query=neetcode+number+of+islands" }, { id: 4, name: "Climbing Stairs", topic: "DP", difficulty: "Easy", platform: "GFG", status: "Revision", video: "https://www.youtube.com/results?search_query=climbing+stairs+dynamic+programming" }, { id: 5, name: "Word Ladder", topic: "Graphs", difficulty: "Hard", platform: "LeetCode", status: "Attempted", video: "https://www.youtube.com/results?search_query=neetcode+word+ladder" }, { id: 6, name: "House Robber", topic: "DP", difficulty: "Medium", platform: "LeetCode", status: "Solved", video: "https://www.youtube.com/results?search_query=neetcode+house+robber" }]
const topics = ["All topics", "Arrays", "DP", "Graphs"]
const difficultyColors = { Easy: "#51d88a", Medium: "#f5a94f", Hard: "#f16f6f" }
const solveData = [{ date: "Aug 01", minutes: 18, name: "Two Sum", difficulty: "Easy" }, { date: "Aug 04", minutes: 42, name: "House Robber", difficulty: "Medium" }, { date: "Aug 07", minutes: 65, name: "Word Ladder", difficulty: "Hard" }, { date: "Aug 10", minutes: 28, name: "Climbing Stairs", difficulty: "Easy" }, { date: "Aug 13", minutes: 51, name: "Number of Islands", difficulty: "Medium" }, { date: "Aug 16", minutes: 74, name: "Edit Distance", difficulty: "Hard" }, { date: "Aug 19", minutes: 35, name: "Valid Parentheses", difficulty: "Easy" }, { date: "Aug 22", minutes: 47, name: "3Sum", difficulty: "Medium" }, { date: "Aug 25", minutes: 22, name: "Binary Search", difficulty: "Easy" }]
const ratings = [{ date: "Aug 01", leetcode: 1780, codeforces: 1320 }, { date: "Aug 05", leetcode: 1808, codeforces: 1350 }, { date: "Aug 09", leetcode: 1798, codeforces: 1340 }, { date: "Aug 13", leetcode: 1836, codeforces: 1410 }, { date: "Aug 17", leetcode: 1824, codeforces: 1440 }, { date: "Aug 21", leetcode: 1862, codeforces: 1490 }, { date: "Aug 25", leetcode: 1894, codeforces: 1530 }]
const languages = [{ name: "C++", value: 42, color: "#6d7cff" }, { name: "Python", value: 31, color: "#51d88a" }, { name: "Java", value: 17, color: "#f5a94f" }, { name: "JavaScript", value: 10, color: "#f16f6f" }]

function DashboardCard({ children, className }: { children: React.ReactNode; className?: string }) { return <section className={cn("rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/80", className)}>{children}</section> }
function CardHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) { return <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p><h2 className="mt-2 text-base font-medium">{title}</h2></div>{action}</div> }

function DashboardPage() { 
  const [stats, setStats] = useState<any>(null);
  const [cfStats, setCfStats] = useState<any>(null);

  const [weeklyTarget, setWeeklyTarget] = useState(15);
  const [monthlyTarget, setMonthlyTarget] = useState(50);
  const [monthStartTotal, setMonthStartTotal] = useState<number>(0);
  const [isEditingMilestones, setIsEditingMilestones] = useState(false);

  useEffect(() => {
    const savedWT = localStorage.getItem("codesync_weekly_target");
    const savedMT = localStorage.getItem("codesync_monthly_target");

    if (savedWT) setWeeklyTarget(Number(savedWT));
    if (savedMT) setMonthlyTarget(Number(savedMT));

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
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Good morning, Umesh.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your consistency is compounding. Keep the streak alive.</p>
        </div>
        <Button variant="outline" className="w-fit gap-2 border-border bg-card/60"><MessageSquare className="size-4" /> Ask CodeSync</Button>
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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={() => setIsEditingMilestones(!isEditingMilestones)}
            >
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
                    <input 
                      type="number" 
                      value={weeklyTarget} 
                      onChange={(e) => saveTargets(Number(e.target.value), monthlyTarget)}
                      className="inline-block w-16 rounded border border-border bg-background px-2 py-0.5 text-lg outline-none"
                    />
                  ) : `${weeklyTarget}`} Solved</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.round((weeklyCurrent / weeklyTarget) * 100))}%` }} 
                  />
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
                    <input 
                      type="number" 
                      value={monthlyTarget} 
                      onChange={(e) => saveTargets(weeklyTarget, Number(e.target.value))}
                      className="inline-block w-16 rounded border border-border bg-background px-2 py-0.5 text-lg outline-none"
                    />
                  ) : `${monthlyTarget}`} Solved</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-chart-2 transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.round((monthlyCurrent / monthlyTarget) * 100))}%` }} 
                  />
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

function ChecklistView() { 
  const [sheet, setSheet] = useState("Blind 75"); 
  const [search, setSearch] = useState(""); 
  const [openId, setOpenId] = useState<number | null>(null); 
  const [solved, setSolved] = useState<number[]>([1, 2, 6]); 
  const filtered = useMemo(() => problems.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [search]); 
  return (
    <>
      <header className="border-b border-border/60 px-6 py-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Workspace / checklist</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Master Checklist</h1>
      </header>
      <div className="mx-auto max-w-[1500px] p-6 lg:p-10">
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-border/70 bg-card/50 p-1">
          {["Blind 75", "NeetCode 150", "Striver A2Z"].map((name) => (
            <button key={name} onClick={() => setSheet(name)} className={cn("rounded-lg px-4 py-2 text-sm", sheet === name ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>{name}</button>
          ))}
        </div>
        <DashboardCard>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-32 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(var(--chart-2) 0 64%, var(--muted) 64% 100%)" }}>
              <div className="flex size-24 flex-col items-center justify-center rounded-full bg-card text-center">
                <span className="text-xl font-semibold">48/75</span>
                <span className="text-[11px] text-muted-foreground">64% solved</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{sheet} progress</p>
              <div className="mt-4 flex gap-4 text-xs">
                <span className="text-chart-2">Easy 24</span>
                <span className="text-chart-3">Medium 19</span>
                <span className="text-chart-4">Hard 5</span>
              </div>
            </div>
          </div>
        </DashboardCard>
        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems..." className="h-10 w-full rounded-lg border border-border bg-card/50 pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </div>
          <Button variant="outline" className="gap-2"><Filter className="size-4" /> Filters</Button>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-card/50">
          {filtered.map((p) => (
            <div key={p.id} className="border-b border-border/60 last:border-b-0">
              <button onClick={() => setOpenId(openId === p.id ? null : p.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40">
                <input type="checkbox" checked={solved.includes(p.id)} onChange={(e) => { e.stopPropagation(); setSolved(e.target.checked ? [...solved, p.id] : solved.filter((id) => id !== p.id)) }} onClick={(e) => e.stopPropagation()} aria-label={`Mark ${p.name} solved`} />
                <span className="flex-1 text-sm">{p.name}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">{p.topic}</span>
                <span className="text-xs text-muted-foreground">{p.difficulty}</span>
                <ChevronDown className={cn("size-4 transition-transform", openId === p.id && "rotate-180")} />
              </button>
              {openId === p.id && (
                <div className="flex flex-wrap items-center gap-3 bg-muted/20 px-12 pb-4">
                  <Button size="sm" onClick={() => alert("Socratic hint: What invariant stays true as the window moves?")}><Sparkles className="size-4" /> Get AI Hint</Button>
                  <Button asChild size="sm" variant="outline"><a href={p.video} target="_blank" rel="noreferrer"><Play className="size-4" /> Watch Solution</a></Button>
                  <input placeholder="Write a markdown note..." className="h-9 min-w-52 flex-1 rounded-md border border-border bg-background/50 px-3 text-xs" />
                  <Button size="sm" variant="outline">Save Notes</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  ) 
}

function AnalyticsPage() { 
  const [range, setRange] = useState("30"); 
  return (
    <>
      <header className="flex flex-col gap-4 border-b border-border/60 px-6 py-6 sm:flex-row sm:items-end sm:justify-between lg:px-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Insights / analytics</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">A clear read on your pace, ratings, and recall.</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[150px] border-border bg-card/60"><SelectValue placeholder="Date range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="365">1 Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <main className="mx-auto grid max-w-[1500px] gap-5 p-6 lg:grid-cols-2 lg:p-10">
        <DashboardCard>
          <CardHeading eyebrow="Velocity / 01" title="Time-to-solve" action={<span className="font-mono text-[10px] text-muted-foreground">minutes</span>} />
          <ChartContainer config={{ easy: { label: "Easy", color: difficultyColors.Easy }, medium: { label: "Medium", color: difficultyColors.Medium }, hard: { label: "Hard", color: difficultyColors.Hard } }} className="mt-6 h-[280px] min-w-0 w-full">
            <ScatterChart margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" name="Date" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <YAxis dataKey="minutes" name="Minutes" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
              <Scatter name="Problems" data={solveData} shape={(props: any) => <circle cx={props.cx} cy={props.cy} r={6} fill={difficultyColors[props.payload.difficulty as keyof typeof difficultyColors]} stroke="var(--background)" strokeWidth={2} />} />
            </ScatterChart>
          </ChartContainer>
        </DashboardCard>

        <DashboardCard>
          <CardHeading eyebrow="Ratings / 02" title="Progression" action={<div className="flex gap-3 font-mono text-[10px]"><span className="text-chart-1">LeetCode</span><span className="text-chart-2">Codeforces</span></div>} />
          <ChartContainer config={{ leetcode: { label: "LeetCode", color: "var(--chart-1)" }, codeforces: { label: "Codeforces", color: "var(--chart-2)" } }} className="mt-6 h-[280px] min-w-0 w-full">
            <LineChart data={ratings} margin={{ left: 0, right: 12, top: 12 }}>
              <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <YAxis domain={[1200, 2000]} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="leetcode" stroke="#6d7cff" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="codeforces" stroke="#51d88a" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
        </DashboardCard>

        <DashboardCard>
          <CardHeading eyebrow="Languages / 03" title="Breakdown" />
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <ChartContainer config={{ cpp: { label: "C++", color: languages[0].color }, python: { label: "Python", color: languages[1].color }, java: { label: "Java", color: languages[2].color }, javascript: { label: "JavaScript", color: languages[3].color } }} className="h-[240px] min-w-0 w-full sm:w-1/2">
              <PieChart>
                <Pie data={languages} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={4}>
                  {languages.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid w-full gap-3 sm:w-1/2">
              {languages.map((language) => (
                <div key={language.name} className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: language.color }} />{language.name}</span>
                  <span className="font-mono text-muted-foreground">{language.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <CardHeading eyebrow="Recall / 04" title="AI revision queue" action={<Sparkles className="size-4 text-sidebar-primary" />} />
          <CardDescription className="mt-2">Problems close to the edge of your forgetting curve.</CardDescription>
          <div className="mt-5 flex flex-col gap-3">
            {problems.slice(2, 6).map((problem, index) => (
              <div key={problem.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/30 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{problem.name}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">Last attempted · Aug {12 + index * 3}, 2026</p>
                </div>
                <Button asChild size="sm" className="shrink-0"><a href="#checklist">Practice Now <ChevronRight className="size-4" /></a></Button>
              </div>
            ))}
          </div>
        </DashboardCard>
      </main>
    </>
  ) 
}

export function DashboardShell({ children }: { children: (view: React.ReactNode) => React.ReactNode }) { 
  const [collapsed, setCollapsed] = useState(false); 
  const [aiChat, setAiChat] = useState(false); 
  const [messages, setMessages] = useState([{ role: "assistant", text: "I’m ready to help you reason through a problem. Ask for a hint, a complexity check, or a concept explanation." }]); 
  const [view, setView] = useState<View>("Dashboard"); 
  
  const renderViewContent = () => {
    switch (view) {
      case "Dashboard": return <DashboardPage />;
      case "Master Checklist": return <ChecklistView />;
      case "Analytics": return <AnalyticsPage />;
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
      <AiChatModal open={aiChat} onClose={() => setAiChat(false)} messages={messages} setMessages={setMessages} />
      <div className={cn("min-h-screen transition-[margin] duration-300", collapsed ? "ml-20" : "ml-64")}>
        {renderViewContent()}
      </div>
    </div>
  ) 
}

export function DashboardContent() { return <DashboardShell>{(content) => content}</DashboardShell> }
export default DashboardContent