"use client"

import { useState, useRef } from "react"
import { RotateCcw, Send, X, Sparkles, Paperclip, FileText, Loader2, Plus, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Notice we added link?: string here!
export type ChecklistItem = { name: string; category: string; difficulty: string; platform: string; link?: string }
type Message = { role: "user" | "assistant"; text: string; checklist?: ChecklistItem[]; fileName?: string }

const starters = [
  "Build a 2-week graph and DP sheet",
  "Top 5 Array questions",
]

export function AiChatModal({ 
  open, 
  onClose, 
  messages, 
  setMessages,
  onAddItems // We pass this from your main page
}: { 
  open: boolean; 
  onClose: () => void; 
  messages: Message[]; 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onAddItems?: (items: ChecklistItem[]) => void
}) {
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const send = async (overrideText?: string) => {
    const promptText = (typeof overrideText === "string" ? overrideText : draft).trim()
    if (!promptText && !attachedFile) return

    const userText = promptText || `Extract the first 50 problems from this uploaded file: ${attachedFile?.name}`
    const fileName = attachedFile?.name
    
    setDraft("")
    setAttachedFile(null)
    setMessages((current) => [...current, { role: "user", text: userText, fileName }])
    setLoading(true)

    try {
      let fileContent = ""
      if (attachedFile) {
        // Read text content of the uploaded file
        fileContent = await attachedFile.text().catch(() => "")
      }

      const res = await fetch("/api/generate-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText, fileContent }),
      })
      
      const data = await res.json()

      if (data.ok && data.checklist) {
        setMessages((current) => [...current, { role: "assistant", text: `Here is your customized roadmap:`, checklist: data.checklist }])
      } else {
        setMessages((current) => [...current, { role: "assistant", text: `Error: ${data.error || "Failed to generate checklist."}` }])
      }
    } catch (err) {
      setMessages((current) => [...current, { role: "assistant", text: "Network error." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-background/60 p-4 backdrop-blur-sm sm:items-center sm:p-8">
      <section className="flex h-[min(700px,calc(100vh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><Sparkles className="size-4" /></div>
            <div><h2 className="text-sm font-semibold">AI Architect</h2></div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            
            {messages.length === 1 && messages[0].role === "assistant" && (
              <div className="flex flex-wrap gap-2">
                {starters.map((starter) => (
                  <Button key={starter} variant="outline" size="sm" onClick={() => send(starter)}>{starter}</Button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={message.role === "user" ? "ml-8 flex flex-col items-end gap-1.5" : "mr-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm"}>
                <p>{message.text}</p>
                
                {message.checklist && message.checklist.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2 border-t pt-3">
                    {message.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2.5 text-xs">
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">{item.category} · {item.difficulty}</p>
                        </div>
                        
                        {/* THE PROBLEM LINK BUTTON */}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-primary hover:underline font-medium">
                            Solve <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    ))}

                    {/* THE ADD TO MASTER CHECKLIST BUTTON */}
                    {onAddItems && (
                      <Button onClick={() => { onAddItems(message.checklist!); onClose(); }} className="mt-2 w-full text-xs" size="sm">
                        <Plus className="size-3.5 mr-1" /> Add to Master Checklist
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline mr-2" /> Generating...</div>}
          </div>
        </div>

        <footer className="border-t p-4 flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <input type="file" ref={fileInputRef} onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} className="hidden" />
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="size-4" /></Button>
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask for roadmap..." />
            <Button size="icon" onClick={() => send()} disabled={loading}><Send className="size-4" /></Button>
          </div>
        </footer>
      </section>
    </div>
  )
}