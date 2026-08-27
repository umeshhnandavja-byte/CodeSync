# CodeSync: Competitive OS & AI DSA Roadmap Generator

CodeSync is a modern, full-stack competitive programming operating system and DSA preparation dashboard built with Next.js. It integrates live platform data tracking, custom AI-driven problem checklists, local-first persistence, and performance analytics into a sleek, dark-mode workspace.

---

## Key Features

* **Live Platform Sync**: Automatically connects and pulls statistics from LeetCode and Codeforces profiles (ratings, ranks, solved counts, and difficulty distributions).
* **AI Roadmap Architect**: Powered by the Groq API (`openai/gpt-oss-20b`), it generates customized, dynamic problem lists and eliminates duplicates automatically.
* **Interactive Master Checklist**: Track your solved problems with persistent checkboxes, search capabilities, quick links to external problem sets, and custom notes.
* **Analytics & Performance Insights**: Visualizes practice times, solve speeds, revision queues, and problem difficulty breakdowns using Recharts.
* **Local-First Persistence**: Leverages browser LocalStorage to keep your milestones, checkboxes, and AI checklists safely saved between sessions.

---

## Tech Stack

* **Framework**: Next.js (App Router)
* **Styling**: Tailwind CSS & custom CSS variables
* **Icons**: Lucide React
* **Charts**: Recharts
* **AI Backend**: Groq SDK / OpenAI-compatible Chat Completions API
* **Package Manager**: pnpm

---

## Getting Started Locally

### Prerequisites
Ensure you have the following installed on your machine:
* Node.js (v18+)
* pnpm (`npm install -g pnpm`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/umeshhnandavja-byte/CodeSync.git](https://github.com/umeshhnandavja-byte/CodeSync.git)
   cd CodeSync