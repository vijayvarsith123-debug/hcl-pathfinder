# PathAI — AI-Powered Personalized Learning Path Recommender Specification

## Product Overview
The purpose of PathAI is to solve one main problem:
Learners know what career they want, but they often don't know:
- What skills they need
- What they should learn first
- What they should learn next
- Which resources are appropriate for their level
- How much they should learn each week
- Whether they are actually progressing
- What to do when they perform poorly

PathAI answers: **"What should I learn next, and why?"**

---

## Core Workflow
User -> Signup/Login -> Onboarding -> Natural Language Career Goal -> Learner Profile -> Diagnostic Assessment -> Skill-Gap Analysis -> Personalized Learning Path -> Weekly Learning Plan -> Free Learning Resources -> Practice -> Project -> Assessment -> Progress Update -> AI Analysis -> Adaptive Learning Path -> Next Recommended Action

---

## Important Product Decisions
1. NOT a course marketplace. Does not host courses.
2. Recommends external learning resources (Free courses, YouTube videos, Documentation, Articles, Tutorials, Practice resources). Prioritizes FREE resources.
3. Main product: Personalized learning path.
4. Weekly learning plan, skill-gap analysis, adaptive learning.
5. AI Tutor is supporting feature, contextual to learning path (NOT generic chatbot).
6. **Formal LIGHT theme only**. White background, light gray sections, professional blue (`#2563EB` / `#1D4ED8`), dark navy text (`#0F172A`), green success states (`#16A34A` / `#15803D`).
7. NO dark theme, NO gaming platform UI, NO excessive animations/gradients/neon/glassmorphism. Subtle shadows and borders.

---

## Target Demo Priority
- Career: **Machine Learning Engineer**
- Goal: "I want to become a Machine Learning Engineer."
- Experience: Beginner/Intermediate
- Existing Skills: Python, SQL, Basic Mathematics
- Weekly availability: 8 hours/week
- Timeline: 8 months

---

## Example Modules & Prerequisites
1. Python Fundamentals
2. NumPy & Pandas
3. Statistics
4. SQL
5. Machine Learning Fundamentals (Prerequisites: Python, NumPy/Pandas, Basic Statistics)
6. Deep Learning (Prerequisites: Python, Machine Learning, Mathematics)
7. Model Deployment
8. MLOps (Prerequisites: Model development, Python, Deployment basics)
9. Capstone Project

---

## Application Structure & Routes
- `/` - Landing Page ("Your Goals. Your Skills. Your Learning Path.")
- `/login` - Login Page
- `/signup` - Signup Page
- `/forgot-password` - Forgot Password Page
- `/onboarding` - Multi-step learner onboarding
- `/dashboard` - Main learner dashboard (Progress, current module, weekly progress, today's tasks, streak, skill progress, recommended next action)
- `/learning-path` - Personalized learning roadmap
- `/weekly-plan` - Weekly learning plan (day-by-day breakdowns matching weekly hours)
- `/resources` - Recommended learning resources
- `/learn/[id]` - Learning resource/topic page
- `/projects` - Skill-aligned projects
- `/assessments` - Skill assessment tests
- `/progress` - Detailed progress dashboard
- `/ai-tutor` - Context-aware AI Tutor
- `/achievements` - Gamification streaks, XP, milestones (professional, non-gaming UI)
- `/settings` - User settings

---

## Technical Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui components, Framer Motion, Recharts, Lucide Icons
- **Backend/DB/Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **AI Integration**: Gemini / LLM API (for goal parsing, recommendations, explanations, AI tutor, weekly review, adaptive suggestions)
