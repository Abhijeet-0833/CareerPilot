# CareerPilot — Real End-to-End Manual Testing Checklist

Use this checklist to perform real manual verification of CareerPilot features.

---

## 1. Authentication & User Security Flow

### Registration & Verification
- [ ] **Register User**: Go to `http://localhost:3000/login` -> Click "Register as Job Seeker" -> Enter Full Name, Email, Password, Confirm Password -> Click Register.
  - **Expected Result**: Account is created with `emailVerified = false` and `role = JOB_SEEKER`. A verification email token is generated.
- [ ] **Check Verification Email**: Open Mailpit Web UI at `http://localhost:8025` (or check configured SMTP inbox).
  - **Expected Result**: Email received with subject *"CareerPilot — Verify your email address"* containing a single-use verification link (`http://localhost:3000/verify-email?token=...`).
- [ ] **Unverified Login Prevention**: Try signing in at `http://localhost:3000/login` before clicking verification link.
  - **Expected Result**: Login fails with message *"Please verify your email before signing in."* and displays a *"Resend Verification Email"* option.
- [ ] **Email Verification Link**: Click the verification link in the email.
  - **Expected Result**: Navigates to `/verify-email`, marks `emailVerified = true`, invalidates verification token, triggers welcome in-app notification, and offers a *"Proceed to Sign In"* button.
- [ ] **Expired / Reused Token Validation**: Click the same verification link again.
  - **Expected Result**: Displays error message *"Verification token has already been used"*.

### Authentication & Logout
- [ ] **Login**: Sign in with verified credentials.
  - **Expected Result**: Authenticates successfully, receives JWT token, loads user profile, role, subscription tier, and redirects to `/dashboard`.
- [ ] **Sign Out**: Click Profile Avatar -> Click *"Sign Out"*.
  - **Expected Result**: Clears `cp_token` and `cp_user` from `localStorage`, revokes session, redirects to `/login`.
- [ ] **Back-Button Access Prevention**: Click browser Back button after Sign Out.
  - **Expected Result**: Protected routes redirect back to `/login`; no cached user data is rendered.

### Password Management
- [ ] **Forgot Password**: Click *"Forgot?"* link on login page -> Enter email.
  - **Expected Result**: Sends password reset email via Mailpit link (`http://localhost:3000/reset-password?token=...`).
- [ ] **Reset Password**: Click reset link -> Enter new password -> Submit.
  - **Expected Result**: Hashes new password with BCrypt, invalidates reset token, and allows signing in with new password.

---

## 2. In-App Notification System
- [ ] **Unread Badge**: Verify Bell icon shows unread count badge (e.g., `1` for welcome notification).
- [ ] **Notification List**: Click Bell icon -> View list of notifications.
- [ ] **Mark as Read**: Click a notification or *"Mark all as read"*.
  - **Expected Result**: Unread count decreases to `0` and notification is marked as read in database.

---

## 3. Resume Optimization & Master Resume Engine
- [ ] **PDF File Upload**: Go to `/resume-analyzer` -> Upload a real PDF file.
  - **Expected Result**: PDFBox extracts text, calculates 7-category explainable ATS score, and stores Master Resume in database.
- [ ] **DOCX File Upload**: Upload a real `.docx` file.
  - **Expected Result**: Apache POI extracts text, updates Master Resume, and displays ATS score.
- [ ] **Structure Analysis**: Click "Analyze Resume Structure".
  - **Expected Result**: Identifies sections and warns if ATS-unfriendly formatting (tables/columns) is detected.
- [ ] **Skill Confirmation**: Proceed to Step 8 in Stepper.
  - **Expected Result**: Categorizes skills into `HIGH`, `MEDIUM`, `LOW` priority. Missing skills are categorized as *"Skill Gap"* without fabricating candidate experience.
- [ ] **AI Visual Diff & Score Differential**: Proceed to Step 10 & 12.
  - **Expected Result**: Displays GREEN (Added), YELLOW (Modified), RED (Removed) visual diffs with Accept/Reject toggles and empirical score improvement badge (e.g., `+17 ATS Improvement`).

---

## 4. Job Description Matcher & Skill Gap Roadmap
- [ ] **JD Parser**: Go to `/jd-analyzer` -> Paste job description -> Click Analyze.
  - **Expected Result**: Extracts title, company, MUST-HAVE vs. GOOD-TO-HAVE skills.
- [ ] **Job Matcher**: Click Match Profile.
  - **Expected Result**: Computes Job Readiness score and missing tech skills.
- [ ] **Personalized Roadmap**: Go to `/roadmap`.
  - **Expected Result**: Displays multi-week curriculum, practice tasks, and project recommendations. Completing a task updates database state.

---

## 5. Application Tracker (Kanban)
- [ ] **Create Application**: Go to `/applications` -> Add new application (e.g., *Stripe - Java Engineer*).
- [ ] **Drag & Status Transition**: Move application from `APPLIED` -> `INTERVIEW`.
  - **Expected Result**: Updates database status and generates an in-app status notification.

---

## 6. AI Mock Interview & AI Career Coach
- [ ] **AI Mock Interview**: Go to `/mock-interview` -> Select "Spring Boot Backend" -> Submit answer.
  - **Expected Result**: Computes answer score, analyzes filler words, provides STAR method suggestions, and loads next question.
- [ ] **AI Coach Context**: Click floating AI Coach chat panel -> Ask questions.
  - **Expected Result**: AI Coach responds using candidate's actual user profile and Master Resume facts.

---

## 7. Role-Based Access Control (RBAC) & Admin Portal
- [ ] **Role Protection**: Try accessing `/admin` as a `JOB_SEEKER`.
  - **Expected Result**: Redirects to `/dashboard` (HTTP 403 / 401 protection on backend).
- [ ] **Admin Metrics**: Log in as an `ADMIN` user -> Go to `/admin`.
  - **Expected Result**: Displays real platform metrics queried directly from database tables (`users`, `subscriptions`, `resumes`, `interviews`).

---

## 8. Database Persistence & User Isolation
- [ ] **Database Persistence**: Create data -> Restart Spring Boot backend -> Refresh frontend.
  - **Expected Result**: All user profiles, resumes, application cards, and notifications remain fully intact.
- [ ] **User Data Isolation**: Log in as User A, inspect data. Log in as User B.
  - **Expected Result**: User B cannot access or view User A's resumes, applications, or notifications.
