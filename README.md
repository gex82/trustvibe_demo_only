# TrustVibe Demo App

A beautiful, fully functional demo of the TrustVibe escrow marketplace for home services in Puerto Rico.

---

## How to Run

### Step 1: Install Node.js (first time only)
Download from [nodejs.org](https://nodejs.org) → install → restart your computer.

### Step 2: Open Terminal / PowerShell
- **Windows**: Press `Win + R`, type `powershell`, press Enter
- Navigate here: type `cd "C:\Users\excj\OneDrive\Documents\TrustVibe_app"` then press Enter

### Step 3: Install dependencies (first time only, ~60 seconds)
```
npm install
```

### Step 4: Start the demo
```
npm run dev
```

### Step 5: Open in browser
Go to: **http://localhost:5173**

### Step 6: Stop the app
Press `Ctrl + C` in the terminal.

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Customer** (Maria Rodriguez) | maria.rodriguez@trustvibe.test | DemoCustomer!123 |
| **Contractor** (Juan's Services) | juan.services@trustvibe.test | DemoContractor!123 |
| **Admin** | admin@trustvibe.test | DemoAdmin!123 |

> **Tip:** Use the floating panel in the bottom-right corner to switch roles instantly!

---

## Demo Story to Tell Clients

### As a Customer (Maria):
1. Log in → see active "Primary Bathroom Renovation" project (already in progress)
2. Tap the project → see escrow details, progress stepper, Juan's accepted quote
3. Go to My Projects → tap "Kitchen Cabinet Repair" (open project)
4. See Juan's quote → tap "Accept This Quote" → Fund Escrow screen
5. Review the trust guarantees → tap "Confirm & Fund Escrow"
6. Switch to Contractor view (use the switcher) to see Juan's perspective

### As a Contractor (Juan):
1. Log in → see earnings dashboard ($9,097 earned total)
2. View active bathroom renovation in escrow ($2,800)
3. Browse open projects → see Kitchen Repair → submit a quote
4. Check Messages → see conversation history with Maria
5. View Earnings → full payment history with fees

### As Admin:
1. Log in → see platform-wide stats and escrow totals
2. Browse all projects → review statuses
3. Dispute Cases → see two real cases with evidence, take action

---

## Deploy Online (Free, No Code Needed)

1. Run: `npm run build`
2. Go to [netlify.com](https://netlify.com) → sign up free
3. Drag the `dist` folder into the browser window
4. Get a public URL in 30 seconds — share with clients!

---

## Language Switch
Click the **EN / ES** button (top right of any screen) to toggle between English and Spanish.
