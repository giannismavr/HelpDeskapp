# HelpDesk Ticketing System

Διαδικτυακή εφαρμογή τύπου **Help Desk / Ticketing System**, όπου οι χρήστες (customers) δημιουργούν αιτήματα υποστήριξης (*tickets*) και το προσωπικό (agent/admin) τα διαχειρίζεται οργανωμένα.

> Υλοποίηση στο πλαίσιο του μαθήματος **«Προγραμματισμός Πλήρους Στοίβας στον Παγκόσμιο Ιστό»**.

---

## Table of Contents

- [Features (Λειτουργίες)](#features-λειτουργίες)
- [Tech Stack (Τεχνολογίες)](#tech-stack-τεχνολογίες)
- [Roles & Permissions (Ρόλοι)](#roles--permissions-ρόλοι)
- [Project Structure (Δομή)](#project-structure-δομή)
- [Quick Start (Τοπική Εκτέλεση)](#quick-start-τοπική-εκτέλεση)
- [Environment Variables (.env)](#environment-variables-env)
- [API Endpoints (Σύνοψη)](#api-endpoints-σύνοψη)
- [Email Notifications](#email-notifications)
- [Database Dump/Restore (mongodump)](#database-dumprestore-mongodump)
- [Troubleshooting](#troubleshooting)

---

## Features (Λειτουργίες)

### Για χρήστες (customer)
- **Register / Login** (αποθήκευση token & user στο localStorage)
- **Δημιουργία ticket** (κατηγορία, προτεραιότητα, περιγραφή)
- **Προβολή των ticket μου** (λίστα + αναζήτηση, φίλτρα status/priority/category, ταξινόμηση)
- **Προβολή λεπτομερειών ticket** + **σχόλια** (conversation ανά ticket)
- **My Account**: προβολή στοιχείων + αλλαγή κωδικού

### Για προσωπικό (agent/admin)
- **Προβολή όλων των tickets**
- **Αλλαγή Status** (*Pending / In Progress / Resolved*)
- **Αλλαγή Priority** (*Low / Medium / High*)
- **Διαγραφή ticket**
- **Σχόλια** σε όλα τα tickets

### Για admin
- **Διαχείριση χρηστών** από UI (`/admin/users`):
  - δημιουργία user / agent / admin
  - αλλαγή role
  - reset password
  - διαγραφή χρήστη

---

## Tech Stack (Τεχνολογίες)

### Frontend
- **React (Vite)**
- **React Router**
- **Bootstrap 5**

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT authentication** (Bearer token)
- **bcrypt** (hash κωδικών)
- **Nodemailer** (email notifications)

---

## Roles & Permissions (Ρόλοι)

| Ρόλος | Tickets list | Ticket details | Status/Priority | Delete | User management |
|------|--------------|----------------|-----------------|--------|-----------------|
| `user` | Μόνο τα δικά του | Μόνο τα δικά του | ❌ | ❌ | ❌ |
| `agent` | Όλα | Όλα | ✅ | ✅ | ❌ |
| `admin` | Όλα | Όλα | ✅ | ✅ | ✅ |

> Σημείωση: Στο backend υπάρχει και endpoint **update ticket** (PATCH `/api/tickets/:id`) με κανόνες:
> - `user`: μόνο αν είναι owner και μόνο όσο το status είναι `Pending` (και δεν μπορεί να αλλάξει priority)
> - `agent/admin`: επιτρέπεται

---

## Project Structure (Δομή)

```
HelpDeskapp-main/
  backend/
    src/
      middleware/        # auth + role middleware
      models/            # Mongoose schemas (User, Ticket)
      routes/            # /api/auth, /api/tickets, /api/users
      scripts/           # seedAdmin.js
      utils/             # mailer
      server.js
    .env
    package.json

  frontend/
    src/
      auth/              # AuthContext, ProtectedRoute, RoleRoute
      components/        # Navbar
      pages/             # Home, Login, Register, MyTickets, TicketDetails, CreateTicket, MyAccount, AdminUsers
      services/          # api wrapper
    package.json

  README.md
```

---

## Quick Start (Τοπική Εκτέλεση)

### Προαπαιτούμενα
- **Node.js 20+** και **npm**
- **MongoDB** (τοπική εγκατάσταση ή service)

### 1) Backend
```bash
cd backend
npm install
```

1. Φτιάξε/έλεγξε το αρχείο `backend/.env` (δες την ενότητα [Environment Variables](#environment-variables-env)).
2. Βεβαιώσου ότι τρέχει το MongoDB.

**(Προαιρετικό) Seed admin account**
```bash
node src/scripts/seedAdmin.js
```

**Εκκίνηση backend**
```bash
npm run dev
```
Το API τρέχει στο: `http://localhost:5001`

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Το UI τρέχει στο: `http://localhost:5173`

---

## Environment Variables (.env)

Το backend χρησιμοποιεί μεταβλητές περιβάλλοντος από `backend/.env`.

Ενδεικτικό παράδειγμα:
```env
# Mongo
MONGO_URI=mongodb://127.0.0.1:27017/helpdeskDB

# Auth
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d

# Seed admin (προαιρετικό)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong_password_here

# Mail (προαιρετικό)
MAIL_FROM=HelpDesk <no-reply@helpdesk.local>

# Αν οριστούν SMTP_* χρησιμοποιείται πραγματικός SMTP provider.
# Αλλιώς, γίνεται auto χρήση Ethereal test account (θα δεις preview link στα logs).
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

⚠️ **Σημαντικό:** Βάλε το `.env` στο `.gitignore` (δεν πρέπει να ανεβαίνει σε GitHub).

---

## API Endpoints

**Base URL:** `http://localhost:5001`

### Auth
- `POST /api/auth/register` → δημιουργία λογαριασμού
- `POST /api/auth/login` → login (επιστρέφει `token` + `user`)
- `GET /api/auth/me` → επιστρέφει τον logged-in χρήστη (requires token)
- `PATCH /api/auth/change-password` → αλλαγή κωδικού (requires token)

### Tickets
- `GET /api/tickets` → λίστα (user: μόνο τα δικά του, staff: όλα)
- `POST /api/tickets` → δημιουργία ticket
- `GET /api/tickets/:id` → λεπτομέρειες ticket
- `PATCH /api/tickets/:id/status` → αλλαγή status (agent/admin)
- `PATCH /api/tickets/:id/priority` → αλλαγή priority (agent/admin)
- `POST /api/tickets/:id/comments` → προσθήκη σχολίου
- `DELETE /api/tickets/:id` → διαγραφή ticket (agent/admin)

### Users (admin)
- `GET /api/users` → λίστα χρηστών
- `POST /api/users` → δημιουργία χρήστη
- `PATCH /api/users/:id/role` → αλλαγή role
- `PATCH /api/users/:id/password` → reset κωδικού
- `DELETE /api/users/:id` → διαγραφή χρήστη

**Authentication:**
- Στείλε header: `Authorization: Bearer <token>`

---

## Email Notifications

Η εφαρμογή στέλνει emails (Nodemailer) σε βασικά γεγονότα:
- επιτυχές register
- δημιουργία ticket
- αλλαγή status
- νέα σχόλια (user ↔ staff)

**Χωρίς SMTP ρυθμίσεις**: δημιουργείται αυτόματα **Ethereal test account** και θα εμφανίζεται στο console ένα **preview link** για να δεις το email.


---

## Troubleshooting

- **`MongoDB Connection Error`**
  - Έλεγξε ότι τρέχει το MongoDB και ότι το `MONGO_URI` είναι σωστό.

- **`Missing token` / `Invalid token`**
  - Χρειάζεται login/registration ώστε να πάρεις token.
  - Σε Postman/Insomnia βάλε `Authorization: Bearer <token>`.

- **Δεν φορτώνει tickets στο UI**
  - Βεβαιώσου ότι τρέχουν και backend (5001) και frontend (5173).

- **Email δεν έρχεται**
  - Αν δεν έχεις βάλει SMTP creds, δες στο console το Ethereal **preview link**.

---

## Creadits

- **Ioannis Mavrodimos**
- **2025–2026**