import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, fileContent, currentProblems = [] } = body

    // 1. Added highly aggressive counting instructions
    const systemPrompt = `You are a strict DSA Preparation API. Your ONLY purpose is to output a valid JSON object. 

CRITICAL RULES:
1. Output ONLY valid JSON. 
2. NO conversational text, NO greetings, NO explanations.
3. The JSON object MUST have a single root key named "checklist" containing an array of objects.
4. Each object MUST have these exact 5 string keys: "name", "category", "difficulty", "platform", "link".
5. The "link" must be a full URL (e.g., https://leetcode.com/problemset/all/?search=problem).
6. EXHAUSTIVE EXTRACTION RULE: If an attached file or study guide text is provided, you MUST extract ALL problems listed within that text. Do not summarize, do not skip sections, and do not stop early. Convert every single valid problem found into the JSON array.
7. EXTREMELY IMPORTANT: Do NOT generate ANY of these problems: [${currentProblems.join(", ")}]. Provide COMPLETELY NEW problems.`

    const userPrompt = `User Request: ${prompt} ${fileContent ? `\nFile Content:\n${fileContent}` : ""}

IMPORTANT: Respond ONLY with the raw JSON object. Start your response with { and end with }.`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // Keep whatever model you are currently using
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        // 🔥 FIX: Give the AI a massive token budget so it doesn't get cut off when typing 20+ problems
        max_tokens: 6000 
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error")
    }

    let content = data.choices[0]?.message?.content || "{}"
    content = content.replace(/```json/g, "").replace(/```/g, "").trim()

    const parsedData = JSON.parse(content)
    let checklist = parsedData.checklist || parsedData.problems || []

    if (checklist.length > 0) {
      const existingNamesLower = currentProblems.map((name: string) => name.toLowerCase().trim())
      checklist = checklist.filter((item: any) => !existingNamesLower.includes(item.name.toLowerCase().trim()))

      const uniqueChecklist = []
      const seen = new Set()
      for (const item of checklist) {
        const lowerName = item.name.toLowerCase().trim()
        if (!seen.has(lowerName)) {
          seen.add(lowerName)
          uniqueChecklist.push(item)
        }
      }
      checklist = uniqueChecklist
    }

    if (checklist.length === 0 && parsedData.checklist?.length > 0) {
      return NextResponse.json({ ok: false, error: "The AI only generated problems you already have! Please ask for a different topic." })
    }

    return NextResponse.json({ ok: true, checklist })
  } catch (error: any) {
    console.error("Checklist Generation Error:", error)
    return NextResponse.json({ ok: false, error: error.message || "Failed to generate roadmap" }, { status: 500 })
  }
}