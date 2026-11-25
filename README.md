# VILLAGECARE – Smart Village Health & Hygiene Monitoring System
### B.Tech Computer Science and Engineering Mini Project & Community Service Project (CSP)
**Project Title:** *Lack of Awareness on Health and Hygiene in the Village*  
**Target Community:** Pentapadu Village, Pentapadu Mandal, West Godavari District, Andhra Pradesh, India.  

---

## 1. Executive Summary

**VILLAGECARE** is a full-stack, responsive web application engineered to bridge the critical public health awareness gap in rural communities. Grounded in field research in Pentapadu Village, the application digitizes household health and hygiene assessments, executes a transparent **Rule-Based Recommendation Engine** to provide culturally appropriate preventive advice in **Telugu and English**, maintains confidential **Maternal and Antenatal Health Tracking** (compliant with National Health Mission and PMSMA protocols), and delivers aggregated village-level analytics to Gram Panchayat administrators and PHC Medical Officers without exposing private medical data.

---

## 2. Technology Stack

- **Frontend:**
  - React.js 18 with Vite
  - Tailwind CSS (Clean healthcare theme with emerald-600, slate-900, mint accents)
  - React Router DOM (v6)
  - Lucide React icons
  - Recharts (Interactive bar, pie, and line charts)
  - Web Speech API integration for Telugu & Indian-English audio guidance
  - Web Notifications API for browser-based reminders
- **Backend:**
  - Node.js & Express.js
  - RESTful API Architecture
  - JWT Authentication & bcrypt password hashing
  - Role-Based Access Control (RBAC)
- **Database & Storage:**
  - MongoDB & Mongoose schemas
  - Zero-config auto-fallback persistent storage (ensures 100% out-of-the-box evaluation without requiring pre-installed MongoDB daemons)
- **Compliance & Privacy:**
  - Digital Personal Data Protection (DPDP) Act, 2023 consent capture
  - Strict separation of public village analytics from confidential maternal records
  - Strictly non-diagnostic and educational rules (no medical prescriptions or disease predictions)

---

## 3. User Roles & Demo Credentials

The platform supports 3 distinct roles with role-based routing and permissions:

| Role | Username | Password | Purpose & Scope |
| :--- | :--- | :--- | :--- |
| **Administrator (PHC Doctor)** | `admin` | `admin123` | Village-level analytics, household management, survey analytics, editable recommendation rules, user authorization. |
| **ASHA / Health Worker** | `asha_pentapadu` | `asha123` | Household registration, multi-section doorstep surveys (A–F), maternal registration with consent, antenatal check-up tracking. |
| **Villager (Resident)** | `villager_ramu` | `villager123` | Personalized hygiene suggestions, Telugu audio, confidential maternal records (if enrolled), DPDP consent preferences. |

> **Note:** A **Quick Role Switcher** is permanently embedded in the top Demo Banner for immediate one-click testing during project evaluation.

---

## 4. Key Modules & Features

### A. Household Registration & Digital Survey Module
- **Pentapadu Street Mapping:** Covers major village localities including *Ramalayam Veedhi, Gandhi Bomma Center, Main Bazaar Road, SC Colony, BC Colony, Canal Bund Road, Subba Rao Peta, ZP High School Road, Rythu Sangham Street, and Panchayat Office Road*.
- **Multi-Section Form (Sections A to F):**
  - **Section A:** Household size, children under 10, elderly members, voluntarily disclosed health concerns.
  - **Section B:** Personal hygiene, handwashing with soap (always / sometimes / rarely), handwash before eating and after latrine.
  - **Section C:** Drinking water source, covered container storage, daily vessel scrubbing, water boiling/treatment when uncertain.
  - **Section D:** Individual household toilet availability, waste disposal (panchayat cart, compost pit, burning, open dumping), wet/dry waste segregation.
  - **Section E:** Menstrual hygiene (asked privately with voluntary consent), awareness level, access to clean materials, safe disposal.
  - **Section F:** Mosquito prevention, stagnant water presence, weekly "Dry Day" water container draining, bed net usage.

### B. Smart Health & Hygiene Recommendation Engine
- Analyzes survey responses and generates actionable, non-diagnostic educational recommendations in Telugu and English.
- Transparent rules editable by an administrator:
  - *IF waterStorage = uncovered* $\rightarrow$ Safe Drinking Water Storage Guidance
  - *IF handwashing = rarely / sometimes* $\rightarrow$ Critical Hand Hygiene with Soap & Water
  - *IF stagnantWater = yes* $\rightarrow$ Dengue & Malaria Prevention: Source Reduction
  - *IF wasteDisposal = openDumping / burning* $\rightarrow$ Safe Waste Disposal & Wet/Dry Segregation
  - *IF menstrualAwareness = needsImprovement* $\rightarrow$ Dignified & Safe Menstrual Management
  - *IF existingConditionsDisclosed != None* $\rightarrow$ Guidance to visit Pentapadu Primary Health Centre (PHC)
- Health workers can mark recommendations as **Shared** or **Followed Up**.

### C. Confidential Maternal & Antenatal Care Module
- Explicit voluntary consent under DPDP Act 2023 recorded before registration.
- Automatic Expected Delivery Date (EDD) computation using Naegele’s Rule ($LMP + 280\text{ days}$).
- Visual pregnancy timeline across 1st, 2nd, and 3rd trimesters.
- Standard Antenatal Check-up (ANC-1 to ANC-4) schedules and monthly **Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)** clinics on the 9th of every month.
- Recording of clinical observations: Blood pressure, weight (kg), hemoglobin (g/dL), fundal height, fetal heart sound, tetanus toxoid (TT) doses, and IFA tablets distributed.
- High-risk pregnancy flags confirmed by healthcare providers.
- **Privacy Assurance:** Never exposed on public dashboards or to other villagers.

### D. Health & Hygiene Awareness Centre
- 10 comprehensive educational categories: *Personal Hygiene, Handwashing, Safe Drinking Water, Household Sanitation, Waste Management, Menstrual Hygiene, Mosquito Prevention, Maternal Health, Child Health & Immunization, Nutrition & Balanced Diet*.
- Natural **Telugu audio narration** via Web Speech API synthesizer for residents with limited digital literacy.
- One-click **Printable A4 Posters** formatted for Gram Panchayat notice boards.
- Frequently Asked Questions (FAQs) and daily golden health rules.
- Fully cited with verified national and global health sources (WHO, MoHFW, NHM, NCVBDCP, Swachh Bharat Grameen).

### E. Village Health Dashboard (Admin Analytics)
- High-level KPIs: Total households, surveyed count, completion rate (%), enrolled villagers.
- Interactive **Recharts** visualizations:
  - Handwashing with soap compliance bar chart
  - Covered vs uncovered water storage distribution
  - Household waste disposal method comparisons
  - Street-wise survey progress breakdown
- Filterable by Pentapadu street.
- Aggregated and anonymized data reporting.

---

## 5. Project Directory Structure

```
villagecare/
├── package.json              # Root orchestration scripts
├── README.md                 # Complete project documentation
├── backend/                  # Node.js & Express REST API
│   ├── .env                  # Environment configuration
│   ├── .env.example          # Sample environment variables
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Express app entry & static UI server
│   └── src/
│       ├── config/           # Database & fallback store config
│       ├── controllers/      # Route controllers (Auth, Survey, Maternal, etc.)
│       ├── data/             # 20 Pentapadu demo households & awareness data
│       ├── middleware/       # JWT protection, RBAC authorize, error handling
│       ├── models/           # Mongoose schemas & collection models
│       ├── routes/           # REST API endpoints
│       └── services/         # Recommendation engine & notification logic
└── frontend/                 # React.js with Vite & Tailwind CSS
    ├── index.html            # App HTML with Noto Sans Telugu & Inter fonts
    ├── package.json          # Frontend dependencies
    ├── vite.config.js        # Vite build & proxy config
    ├── tailwind.config.js    # Healthcare palette theme configuration
    └── src/
        ├── App.jsx           # Main router & layout architecture
        ├── main.jsx          # React DOM entry
        ├── components/       # Reusable components (Navbar, Footer, AudioPlayer, etc.)
        ├── context/          # AuthContext, LanguageContext, NotificationContext
        ├── locales/          # en.js & te.js bilingual dictionaries
        ├── pages/            # Role pages (Admin, Health Worker, Villager, Awareness)
        └── services/         # API fetch client
```

---

## 6. Setup and Execution Instructions

### Prerequisites
- Node.js (v18 or higher; tested on Node v24)
- npm (v9 or higher)
- Optional: Local MongoDB or MongoDB Atlas connection string (auto-fallback to zero-config persistent store is enabled by default)

### Quick Start (Single Command)

1. Clone or navigate into the project directory:
   ```bash
   cd villagecare
   ```

2. Start the unified full-stack application:
   ```bash
   npm start
   ```
   *The server will start on port 5000 and automatically serve both the REST API endpoints and the compiled React application!*

3. Open your browser and visit:
   ```
   http://localhost:5000
   ```

---

### Development Mode (Separate Frontend & Backend)

#### A. Backend Setup
```bash
cd villagecare/backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

#### B. Frontend Setup
```bash
cd villagecare/frontend
npm install
npm run dev
```
*Frontend Vite dev server runs on `http://localhost:3000` with automatic API proxy to port 5000.*

---

## 7. REST API Documentation Summary

### Authentication & Consent
- `POST /api/auth/register` – Register staff or villager account
- `POST /api/auth/login` – Authenticate user and receive JWT token
- `GET /api/auth/me` – Retrieve current authenticated user profile
- `PUT /api/auth/consent` – Update DPDP Act 2023 consent preferences or submit data correction request
- `GET /api/auth/users` – Admin: List all authorized users and health workers

### Households
- `GET /api/households` – List households (supports `?street=` and `?search=`)
- `POST /api/households` – Register new household with street and age group breakdown
- `GET /api/households/:id` – Retrieve household details, survey history, and recommendations
- `PUT /api/households/:id` – Update household details
- `DELETE /api/households/:id` – Admin: Delete household and associated records

### Doorstep Surveys
- `GET /api/surveys` – List survey records
- `POST /api/surveys` – Submit multi-section survey (A–F) and trigger recommendation engine
- `GET /api/surveys/:id` – Retrieve survey details and generated recommendations
- `PUT /api/surveys/:id` – Update survey responses and re-evaluate recommendations

### Recommendation Engine
- `GET /api/recommendations/:householdId` – Fetch recommendations for a household
- `PUT /api/recommendations/:id/status` – Health worker: Update status to `shared` or `followed_up`
- `GET /api/recommendations/rules` – View active rule base and public health principles
- `PUT /api/recommendations/rules` – Admin: Update or edit transparent rule base

### Maternal & Antenatal Health
- `GET /api/pregnancy` – List maternal records (role-restricted)
- `POST /api/pregnancy` – Register pregnant mother with explicit consent; auto-schedules ANC visits
- `GET /api/pregnancy/:id` – View confidential maternal record and appointment timeline
- `PUT /api/pregnancy/:id` – Update maternal record details

### Appointments & Observations
- `GET /api/appointments` – Fetch scheduled/completed/missed antenatal check-ups
- `POST /api/appointments` – Schedule new check-up or PMSMA visit
- `PUT /api/appointments/:id` – Record clinical observations (BP, Hb, weight, TT, IFA)

### Dashboard Analytics
- `GET /api/dashboard/statistics` – Village KPI statistics (anonymized)
- `GET /api/dashboard/survey-analytics` – Recharts-ready aggregations for hygiene, water, and sanitation

### Awareness & Notifications
- `GET /api/awareness` – List educational modules with Telugu/English text, audio transcripts, and sources
- `GET /api/notifications` – Fetch role-specific notifications and appointment reminders
- `PUT /api/notifications/:id/read` – Mark notification as read
- `POST /api/notifications` – Admin/ASHA: Dispatch public health broadcast campaign

### Demo Data Control
- `GET /api/demo/status` – Check demonstration data status
- `POST /api/demo/seed` – Reset/seed 20 Pentapadu sample households and maternal records
- `POST /api/demo/clear` – Clear demonstration dataset

---

## 8. Verification and Evaluation Checklist

- [x] **Full-Stack Execution:** React + Vite + Express + Node.js + Mongoose/Store.
- [x] **Target Community Context:** Pentapadu Village, Pentapadu Mandal, West Godavari District, AP.
- [x] **Bilingual Support:** Full Telugu and English toggle for all navigation items, survey questions, and educational modules.
- [x] **Role-Based Access Control:** Separate responsive dashboards for Admin, Health Worker, and Villager.
- [x] **Multi-Section Survey:** Sections A through F with step-by-step navigation and validation.
- [x] **Smart Recommendation Engine:** Transparent, non-diagnostic rules with bilingual guidance and reason explanations.
- [x] **Confidential Maternal Health:** Explicit DPDP consent, Naegele's EDD calculation, ANC-1 to ANC-4 tracking, PMSMA clinic alerts, clinical observations (BP, Hb, TT, IFA).
- [x] **Analytics Dashboard:** Recharts visualizations with street filtering and strict privacy anonymization.
- [x] **Awareness Centre:** 10 categories, Web Speech API Telugu audio narrator, printable A4 posters, official WHO/NHM citations.
- [x] **Demonstration Data:** 20 realistic Pentapadu households across 10 streets with reset capability.

---
*Developed for academic evaluation in B.Tech Computer Science and Engineering.*
