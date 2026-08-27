"use client"

import { useState } from "react"
import { Check, Code2, ExternalLink, Globe2, Save, UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const platforms = [
  { name: "LeetCode", description: "Sync solved problems, contests, and daily streaks.", icon: Code2, handle: "alex.codes", connected: true },
  { name: "Codeforces", description: "Import ratings, submissions, and contest performance.", icon: Globe2, handle: "alex_cp", connected: true },
  { name: "GeeksforGeeks", description: "Keep your practice history in one focused workspace.", icon: Code2, handle: "", connected: false },
]

function SettingsCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <Card className={`border-border/70 bg-card/60 backdrop-blur-md ${className}`}>{children}</Card>
}

export function SettingsView() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [socraticMode, setSocraticMode] = useState(true)
  const [connected, setConnected] = useState<Record<string, boolean>>({ LeetCode: true, Codeforces: true, GeeksforGeeks: false })
  const [saved, setSaved] = useState(false)

  return <>
    <header className="border-b border-border/60 px-6 py-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Workspace / settings</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Connect your accounts and tune your CodeSync workspace.</p>
    </header>
    <main className="mx-auto max-w-[1100px] p-6 lg:p-10">
      <Tabs defaultValue="integrations" className="flex flex-col gap-6">
        <TabsList className="grid h-auto w-full max-w-xl grid-cols-3 border border-border/70 bg-card/60 p-1">
          <TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="integrations">Integrations</TabsTrigger><TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-0">
          <SettingsCard><CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update the identity shown across your CodeSync workspace.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-4"><Avatar className="size-16 border border-border"><AvatarImage src="/avatar.png" alt="Alex Morgan" /><AvatarFallback>AM</AvatarFallback></Avatar><div className="flex flex-col gap-2"><Button variant="outline" size="sm">Upload avatar</Button><p className="text-xs text-muted-foreground">PNG or JPG, up to 2MB.</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" defaultValue="Alex Morgan" /></div><div className="flex flex-col gap-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" defaultValue="alex@codesync.dev" /></div></div>
            <Button className="w-fit gap-2" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800) }}>{saved ? <Check data-icon="inline-start" /> : <Save data-icon="inline-start" />}{saved ? "Saved" : "Save profile"}</Button>
          </CardContent></SettingsCard>
        </TabsContent>
        <TabsContent value="integrations" className="mt-0 flex flex-col gap-4">
          <div><h2 className="text-lg font-medium">Connected platforms</h2><p className="mt-1 text-sm text-muted-foreground">Link your competitive programming accounts to keep progress in sync.</p></div>
          {platforms.map(({ name, description, icon: Icon, handle, connected: initial }) => { const isConnected = connected[name] ?? initial; return <SettingsCard key={name}><CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40"><Icon className="size-5 text-sidebar-primary" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{name}</h3>{isConnected && <Badge variant="secondary" className="gap-1 text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-400" />Connected</Badge>}</div><p className="mt-1 text-xs text-muted-foreground">{description}</p></div></div><div className="flex w-full gap-2 sm:w-auto"><Input aria-label={`${name} handle`} placeholder="Handle / Username" defaultValue={handle} className="sm:w-48" /><Button variant={isConnected ? "outline" : "default"} onClick={() => setConnected((current) => ({ ...current, [name]: true }))}>{isConnected ? "Reconnect" : "Connect"}</Button></div></CardContent></SettingsCard> })}
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ExternalLink className="size-3" />We only use your public profile data to calculate progress.</p>
        </TabsContent>
        <TabsContent value="preferences" className="mt-0"><SettingsCard><CardHeader><CardTitle>Preferences</CardTitle><CardDescription>Shape your daily preparation rhythm and coaching style.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6"><div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label>Default prep sheet</Label><Select defaultValue="blind"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="blind">Blind 75</SelectItem><SelectItem value="neetcode">NeetCode 150</SelectItem></SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="daily-goal">Daily goal</Label><Input id="daily-goal" type="number" min="1" max="50" defaultValue="3" /></div></div><div className="divide-y divide-border/60 rounded-xl border border-border/60"><div className="flex items-center justify-between gap-4 p-4"><div><p className="text-sm font-medium">Email Notifications</p><p className="mt-1 text-xs text-muted-foreground">Receive your daily progress recap.</p></div><Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} aria-label="Email Notifications" /></div><div className="flex items-center justify-between gap-4 p-4"><div><p className="text-sm font-medium">AI Socratic Mode</p><p className="mt-1 text-xs text-muted-foreground">Hints only, never full solutions or code.</p></div><Switch checked={socraticMode} onCheckedChange={setSocraticMode} aria-label="AI Socratic Mode" /></div></div><Button className="w-fit gap-2" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800) }}>{saved ? <Check data-icon="inline-start" /> : <Save data-icon="inline-start" />}{saved ? "Saved" : "Save preferences"}</Button></CardContent></SettingsCard></TabsContent>
      </Tabs>
    </main>
  </>
}
