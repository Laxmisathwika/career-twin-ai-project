# Career Twin AI — AI-Powered Career Guidance Platform

**Institution:** Vignan Institute of Technology and Science, Deshmukhi  
**Department:** Computer Science & Machine Learning (CSM)  
**Academic Year:** 2026–2027  
**Batch Target:** B.Tech 3rd & 4th Year Campus Placements

---

## 1. Overview

**Career Twin AI** is a complete, full-stack, AI-powered career guidance platform engineered specifically for engineering students at **Vignan Institute of Technology and Science, Deshmukhi (CSM)**. It unifies:

1. **AI Career Assessment**: Multi-dimensional evaluation across algorithms, systems, cloud, data, and design.
2. **Personalized Learning Roadmap**: 4-stage progression (Foundations, Core & Frameworks, Advanced Systems, Industry Readiness) with free verified external resources (MIT OCW, Kaggle, freeCodeCamp, DeepLearning.AI).
3. **Engineering Resume Builder**: Live ATS-friendly templates (Classic Modern & Minimal Tech), real-time preview, bullet point impact optimizers, and direct PDF download.
4. **Interactive Mock Interview Arena**: Role-specific questions (AI/ML, SDE, Cloud/DevOps, Behavioral STAR) with scoring across Relevance, Clarity, and Technical Depth, accompanied by benchmark sample answers.
5. **AI Career Mentor Chatbot**: Real-time guidance on projects, tech stacks, and campus placement rounds backed by server-side Gemini 3.8 Flash.
6. **Jobs & Internships Explorer**: Curated opportunities for 2026–2027 batch with live application tracking pipelines (TCS Digital, Microsoft, Cognizant, Razorpay).
7. **Student Profile**: Academic credentials, CGPA, semester, technical skills, and JSON data backup/export.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express, tsx
- **AI Engine:** Google Gemini API (`@google/genai`) with model `gemini-3.8-flash` via secure server-side endpoints
- **PDF Generation:** jsPDF and browser print engine
- **Persistence:** LocalStorage session state management with exportable JSON backups and seamless fallback

---

## 3. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# GEMINI_API_KEY: Optional for live AI capabilities.
# If omitted or unavailable, the application gracefully operates in Curated Mode
# with verified VITS CSM placement and engineering intelligence.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: The base URL of the application
APP_URL="http://localhost:3000"

# PORT: Server port (defaults to 3000)
PORT=3000
```

---

## 4. Local Setup & Running

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server (Full-Stack Express + Vite):**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## 5. Architecture & Security

- **Server-Side AI API Calls:** All `@google/genai` calls execute exclusively on the server (`server.ts`). No API keys or secrets are ever exposed in client code.
- **Transparent AI Status:** The UI clearly differentiates between **Live AI** (when `GEMINI_API_KEY` is present) and **Curated Mode** (domain-verified fallback), ensuring complete honesty without fabricated statistics or fake AI states.
- **Client Data Protection:** Student profiles, custom roadmap items, and tracked applications are stored in user-isolated client storage with one-click JSON backup export.
