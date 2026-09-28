# AI Career OS (CareerPilot) — Production AI Career SaaS Platform

> **Your AI Career, From Resume to Offer.**  
> A production-grade SaaS platform featuring Glassmorphism UI/UX, Spring Boot 3 Java backend, AI ATS Resume Parsing, JD Matching Engine, Skill Gap Roadmaps, AI Mock Interviewer with English Coach, and Kanban Application Tracker.

---

## 🌟 Key Features

1. **Premium Glassmorphism UI/UX**: Built with React 18, Vite, TypeScript, Tailwind CSS, and Framer Motion micro-interactions. Includes Dark and Light mode support.
2. **AI ATS Resume Analyzer**: Multi-stage parsing loader, category score breakdowns (Keywords, Skills, Experience, Projects, Formatting), missing keyword checklist, and factual resume tailoring.
3. **Job Description Analyzer & Role Matcher**: Parses raw JDs, categorizes MUST-HAVE vs GOOD-TO-HAVE skills, and calculates Job Readiness Scores with top 3 recommendations.
4. **Personalized Learning Roadmap & Project Engine**: Multi-week learning curriculum, practice tasks, interview questions, and portfolio project architecture blueprints.
5. **AI Mock Interview Simulator & English Coach**: Dynamic technical question stream with real-time filler word analysis, grammar feedback, answer rewrites, and scorecards.
6. **Kanban Application Tracker**: Interactive drag/move application pipeline (`SAVED`, `APPLIED`, `ASSESSMENT`, `INTERVIEW`, `HR`, `OFFER`, `REJECTED`) with Canvas Confetti celebration effects.
7. **Role-Based Portals**:
   - Candidate Portal
   - Recruiter Talent Sourcing Hub
   - College Placement Officer Portal
   - System Admin & AI Token Telemetry Dashboard
8. **Monetization & Razorpay Integration**: Tiered subscriptions (Free, Pro, Premium, Business, College) with simulated Razorpay checkout and verification.

---

## 🛠️ Quick Start Instructions

### Prerequisites
- **Java**: JDK 17+
- **Maven**: 3.9+
- **Node.js**: v20+ & npm

### 1. Run Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
- **Swagger UI API Docs**: `http://localhost:8080/swagger-ui.html`
- **H2 Console**: `http://localhost:8080/h2-console`

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

---
*Developed as a complete commercial SaaS product for career growth and offer acceleration.*
