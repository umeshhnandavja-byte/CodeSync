"use client"

import { useState, useEffect } from "react"
import { Check, Code2, ExternalLink, Globe2, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const basePlatforms = [
  { name: "LeetCode", description: "Sync solved problems, contests, and daily streaks.", icon: Code2 },
  { name: "Codeforces", description: "Import ratings, submissions, and contest performance.", icon: Globe2 },
]

function SettingsCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <Card className={`border-border/70 bg-card/60 backdrop-blur-md ${className}`}>{children}</Card>
}

export function SettingsView() {
  const [saved, setSaved] = useState(false)

  // Profile fields state
  const [displayName, setDisplayName] = useState("Umesh Nanda")
  const [email, setEmail] = useState("umesh@codesync.dev")

  const [handles, setHandles] = useState({
    LeetCode: "Umeshh_Nanda",
    Codeforces: "tourist",
  })
  
  const [connected, setConnected] = useState<Record<string, boolean>>({ 
    LeetCode: true, 
    Codeforces: true, 
  })

  // Load persisted settings on mount
  useEffect(() => {
    const savedLc = localStorage.getItem("leetcode_username")
    if (savedLc) setHandles(prev => ({ ...prev, LeetCode: savedLc }))

    const savedCf = localStorage.getItem("codeforces_handle")
    if (savedCf) setHandles(prev => ({ ...prev, Codeforces: savedCf }))

    const savedName = localStorage.getItem("codesync_display_name")
    if (savedName) setDisplayName(savedName)

    const savedEmail = localStorage.getItem("codesync_email")
    if (savedEmail) setEmail(savedEmail)
  }, [])

  const handleConnect = (name: string) => {
    const handleValue = handles[name as keyof typeof handles]
    
    if (name === "LeetCode") {
      localStorage.setItem("leetcode_username", handleValue.trim())
    }
    if (name === "Codeforces") {
      localStorage.setItem("codeforces_handle", handleValue.trim())
    }

    setConnected((current) => ({ ...current, [name]: true }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveProfile = () => {
    localStorage.setItem("codesync_display_name", displayName.trim())
    localStorage.setItem("codesync_email", email.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return <>
    <header className="border-b border-border/60 px-6 py-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Workspace / settings</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Connect your accounts and tune your CodeSync workspace.</p>
    </header>
    <main className="mx-auto max-w-[1100px] p-6 lg:p-10">
      <Tabs defaultValue="integrations" className="flex flex-col gap-6">
        <TabsList className="grid h-auto w-full max-w-xl grid-cols-2 border border-border/70 bg-card/60 p-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <SettingsCard>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update the identity shown across your CodeSync workspace.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <Button className="w-fit gap-2" onClick={handleSaveProfile}>
                {saved ? <Check data-icon="inline-start" /> : <Save data-icon="inline-start" />}
                {saved ? "Saved" : "Save profile"}
              </Button>
            </CardContent>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 flex flex-col gap-4">
          <div><h2 className="text-lg font-medium">Connected platforms</h2><p className="mt-1 text-sm text-muted-foreground">Link your competitive programming accounts to keep progress in sync.</p></div>
          {saved && <p className="text-xs font-mono text-emerald-400">Successfully updated and saved configuration!</p>}
          
          {basePlatforms.map(({ name, description, icon: Icon }) => { 
            const isConnected = connected[name] ?? false; 
            const currentHandle = handles[name as keyof typeof handles];

            return <SettingsCard key={name}><CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40"><Icon className="size-5 text-sidebar-primary" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{name}</h3>{isConnected && <Badge variant="secondary" className="gap-1 text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-400" />Connected</Badge>}</div><p className="mt-1 text-xs text-muted-foreground">{description}</p></div></div><div className="flex w-full gap-2 sm:w-auto"><Input aria-label={`${name} handle`} placeholder="Handle / Username" value={currentHandle} onChange={(e) => setHandles({ ...handles, [name]: e.target.value })} className="sm:w-48" /><Button variant={isConnected ? "outline" : "default"} onClick={() => handleConnect(name)}>{isConnected ? "Update" : "Connect"}</Button></div></CardContent></SettingsCard> 
          })}
          
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ExternalLink className="size-3" />We only use your public profile data to calculate progress.</p>
        </TabsContent>
      </Tabs>
    </main>
  </>
}

export default SettingsView