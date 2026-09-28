# AI Career OS (CareerPilot) — Architecture Specification

## 1. System Overview
**AI Career OS** is a production-ready, multi-tenant AI SaaS platform built for candidates, recruiters, and placement institutions. The application guides candidates across the entire career journey:

```
USER PROFILE → MASTER RESUME → JD PARSING → MATCH SCORE → SKILL GAP ROADMAP → TAILORED RESUME → APPLICATION TRACKING → AI MOCK INTERVIEW → OFFER
```

---

## 2. Technology Stack

### Frontend Architecture
- **Framework**: React 18 + Vite + TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Custom Glassmorphism Token Utilities (`glass-panel`, `glass-card`, `glass-input`)
- **Animations**: Framer Motion (page transitions, micro-interactions, modal scale entrance, floating cards)
- **Charts**: Recharts (Radar charts for skill overlap, Bar charts for application stages)
- **Celebration Effects**: Canvas Confetti (Offer status transitions & subscription upgrade)
- **State Management**: React Context (`AuthContext` for RBAC & JWT, `ThemeContext` for Dark/Light mode)

### Backend Architecture
- **Framework**: Java 17 LTS / Spring Boot 3.2.x
- **Security**: Spring Security 3.x with stateless `JwtAuthenticationFilter`, BCrypt password hashing, and role-based access control (`JOB_SEEKER`, `RECRUITER`, `ADMIN`, `COLLEGE_ADMIN`)
- **Persistence**: Spring Data JPA + Hibernate + H2 Database (Dev) / PostgreSQL (Prod)
- **AI Abstraction**: Pluggable `AIProvider` interface supporting `MockAIProvider` (internal keyword extraction & filler word analysis) and external AI adapters (`OpenAIProvider`, `GeminiProvider`)
- **Documentation**: OpenAPI 3.0 / Swagger UI (`/swagger-ui.html`)

---

## 3. Security & Factual Integrity Rules
- **No Fabricated Information**: The AI parser and tailored resume engine improve wording, extract matching keywords, and highlight existing candidate experience, but strictly preserve factual accuracy (no fake companies, degrees, or certifications).
- **Stateless Authentication**: JWT bearer tokens signed with HMAC-SHA256 signature verification.
- **Role-Based Access Control**: Standardized permissions across Job Seeker, Recruiter, College Placement, and System Admin roles.
