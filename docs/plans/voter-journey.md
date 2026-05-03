## 1. Overall plan (what, why, phases)

### 1.1 What we are developing

A web-based, gamified assistant that teaches and guides Indian first‑time voters (and school students) through the entire voter registration journey, with special focus on:

- Understanding who can register and what “ordinary residence” means, using real ECI rules and Form 6 guidelines.[^1][^2]
- Knowing the correct official channels for online registration (Voter Portal / NVSP / Voter Helpline App).[^3][^4][^5]
- Preparing required documents properly (age proof, address proof, identity) based on official Form 6 requirements.[^2][^1]
- Connecting Delhi users to real‑world voter centres/AEROs via map visualizations.[^6][^7]
- Doing all of this with an AI explainer powered by Gemini + File Search over official PDFs and CEO documents (Form 6, guidelines, CEO Delhi guides).[^8][^1][^2]

The assistant is not a replacement for the official portal; it is a “coach” that sits above it: explaining, simulating, and then pushing the user to the real voter registration systems (voters.eci.gov.in, NVSP, Voter Helpline app).[^4][^5][^3]

### 1.2 Why we are developing it

- First‑time voters struggle with:
    - Understanding eligibility, especially around age, residence, and moving cities.[^2][^3]
    - Form 6 complexity: bilingual fields, relative details, declarations, document proofs.[^1][^8][^2]
    - Knowing where and how to register (Voter Portal vs NVSP vs Voter Helpline app).[^3][^4]
    - Finding local support points like voter centres, especially in cities like Delhi.[^7][^6]
- Schools and colleges need:
    - An interactive civics tool that’s more engaging than static PDFs.
    - Something they can use in a 30–45 minute session to walk students through the registration idea end‑to‑end.

Your assistant solves this with:

- Plain-language explanations grounded in official documents, using Gemini File Search as the brain.[^8][^1][^2]
- Visual steps and simulations instead of dense text.
- Maps and real Delhi voter centre data to make “where do I go?” tangible.[^6][^7]
- Gamified challenges and rewards to keep school‑age users engaged.


### 1.3 Phases of the voter registration journey

Design your product roadmap around clear user phases. Each phase corresponds to one or more UI sections and a set of backend behaviours.

**Phase 0 – Onboarding (Know your journey)**
Goal: User understands that this is a learning/guide tool, not the official form, and chooses their path.

- Ask: “I’m 18+ and want to register” vs “I’m learning for the future.”
- Explain that the app uses official Election Commission rules and shows the official portals.[^1][^2][^3]
- Store chosen path and approximate age band in session state.

**Phase 1 – Eligibility \& basic concepts**

Goal: User learns who can register and whether they are (theoretically) eligible.

- Explain:
    - Age 18+ and other basics (citizenship, ordinary residence).[^2][^3]
    - The concept of electoral rolls.
    - That Form 6 is for new general voters; Form 6A/7/8 exist for other cases (just introduce them).[^3]
- Use a wizard with simple questions and scenario quizzes.

AI integration:
When a user clicks “Why does age matter?” or similar, AI answers using Form 6 guidelines and ECI content stored in File Search.[^1][^2][^3]

**Phase 2 – Residence \& constituency (with Maps)**

Goal: User understands what “ordinarily resident” means and how it maps to an Assembly Constituency and voter centre.

- Explain “ordinary residence” using examples like home, hostel, PG, moving between cities.[^8][^2]
- For Delhi focus:
    - Show voter centre locations from CEO Delhi/AERO listings.[^7][^6]
    - Approximate “there will be a polling station near you, often in schools/community halls” using CEO info.[^9]

Maps integration:

- User searches locality/pin.
- Map shows approximate area and one or more voter centre points (from your curated dataset for demo).
- Panels explain that real polling station details come from official search/electoral roll tools.[^9][^3]

**Phase 3 – Document readiness**

Goal: User knows what documents and details to keep ready for Form 6.

- Use official Form 6 to derive:
    - Personal details needed.[^1]
    - Relative details (father/mother/spouse/guardian etc.)[^1]
    - Age proof examples.[^2][^1]
    - Address proof examples.[^2][^1]
- Turn this into a checklist and a progress meter (“Backpack ready 80%”).

AI integration:

- “Is school certificate ok for age proof?” → AI answers from the Form 6 annexure/guidelines.[^2][^1]

**Phase 4 – Online registration walkthrough**

Goal: User can confidently use the official Voter Portal / NVSP / Voter Helpline App to actually apply.

- Explain the main online channels:
    - Voter Portal / voters.eci.gov.in.[^3]
    - NVSP.[^10][^3]
    - Voter Helpline app: what it can do.[^5][^4]
- Provide a step-by-step simulated journey:

1. Signup/login on the portal/app.
2. Choose “Form 6 / New voter registration”.[^4][^5][^3]
3. Fill personal details.
4. Fill residence details.
5. Upload documents.
6. Submit and save reference number.[^5][^1]

You never submit anything yourself; instead, you open official sites/apps in a new tab/QR and serve as a live coach.

**Phase 5 – Status \& next steps**

Goal: User knows what happens after submission and how to check status.

- Explain:
    - That they’ll receive a reference ID.
    - That they can use Voter Portal/NVSP/Voter Helpline to track status.[^10][^4][^3]
    - Basic stages: Submitted → Under verification → Accepted/rejected → EPIC/e‑EPIC.[^10][^4]
- Provide a dummy “status simulator” in your app to teach them the meaning of each stage.

**Phase 6 – Revision \& reinforcement (gamified)**

Goal: Reinforce learning and give a sense of achievement.

- Quizzes on:
    - Which form for which scenario (Form 6 vs 6A vs 7 vs 8).[^3]
    - Which documents are acceptable for age/address.[^1][^2]
    - What constitutes ordinary residence.[^8][^2]
    - Where to go if they need help (AERO, voter centre, CEO site, helpline).[^6][^9][^4]
- Badges:
    - Form 6 Pro
    - Residence Ranger
    - Portal Navigator
    - Delhi Voter Centre Explorer

***
