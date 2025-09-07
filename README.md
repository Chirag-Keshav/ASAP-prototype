# 📦 ASAP (Amrita Services And Packages)

ASAP is a campus-exclusive mobile app for students to send and receive packages within the college.  
Students can act as both **Customers** (placing delivery requests) and **Porters** (accepting and completing deliveries).  

---

## 🌟 Features

### 🔑 Authentication
- Signup/Login via **student email** and **phone number**
- OTP verification for both email and phone
- Terms & Conditions popup  
  > "We are not responsible for the misplacement of your packages"

### 👤 Roles
- **Customer (default view)**: Create package delivery requests  
- **Porter**: Accept and complete package deliveries  
- Easy **switch** between roles from the top-right icon  

### 📱 Customer Flow
- Dashboard with:
  - **Active Deliveries** (track progress, cancel/edit before acceptance)
  - **History** (completed deliveries)
- Place new requests with:
  - Service type (currently only **Package**)
  - Hostel & room number (dropdown with all hostels)
  - Optional delivery instructions
- View porter details and ETA once request is accepted
- Mark deliveries as **Received**

### 🚲 Porter Flow
- View list of all open delivery requests
- See request details (hostel, room, customer info, instructions)
- **Accept** or **Decline** requests
- Once accepted:
  - Set ETA from a preset dropdown (10–120 mins)
  - Delivery is locked (hidden from other porters)
- Can **cancel** an accepted request (re-opens to others)

### 🔔 Notifications
- Customer gets notified when:
  - A porter accepts their request
  - Porter cancels
  - ETA is set/updated
- Porter gets notified when:
  - New requests are posted
  - Customer cancels a request

### 🏢 Supported Hostels
1. Agasthya Bhavanam (Male)  
2. Gauthama Bhavanam (Male)  
3. Kapila Bhavanam (Male)  
4. Vasishta Bhavanam (Male)  
5. Vyasa Maharshi Bhavanam (Male)  
6. Nachiketas Bhavanam (Male)  
7. Yagnavalkya Bhavanam (Male)  
8. Kasyapa Bhavanam (Male)  
9. Bhrigu Bhavanam (Male)  
10. Gargi Bhavanam (Female)  
11. Mythreyi Bhavanam (Female)  
12. Adithi Bhavanam (Female)  
13. Savithri Bhavanam (Female)  

---

## ⚙️ Tech Stack

- **Frontend/UI** → React Native (prototyped with Bolt.new / Uizard / Locofy)  
- **Backend & Auth** → Supabase (Postgres DB + Email/Phone OTP auth)  
- **Notifications** → OneSignal integration  
- **Deployment** → Firebase Hosting / Vercel  

---

## 📊 Database Schema (Supabase)

### Users
| Column       | Type    | Notes                              |
|--------------|---------|------------------------------------|
| id           | UUID    | Primary key                        |
| email        | Text    | Unique, student email              |
| phone        | Text    | Unique, verified with OTP          |
| username     | Text    | Chosen by student                  |
| hostel       | Text    | Current hostel                     |
| room_number  | Text    | Current room                       |
| created_at   | Time    | Auto timestamp                     |

### Requests
| Column       | Type    | Notes                              |
|--------------|---------|------------------------------------|
| id           | UUID    | Primary key                        |
| customer_id  | UUID    | FK → users.id                      |
| service_type | Text    | Default "package"                  |
| hostel       | Text    | Delivery hostel                    |
| room_number  | Text    | Delivery room                      |
| instructions | Text    | Optional                           |
| status       | Text    | pending / accepted / cancelled / completed |
| porter_id    | UUID    | FK → users.id (assigned porter)    |
| eta_minutes  | Int     | ETA chosen by porter               |
| created_at   | Time    | Auto timestamp                     |
| updated_at   | Time    | Auto update                        |

### Deliveries (optional history table)
| Column       | Type    | Notes                              |
|--------------|---------|------------------------------------|
| id           | UUID    | Primary key                        |
| request_id   | UUID    | FK → requests.id                   |
| customer_id  | UUID    | FK → users.id                      |
| porter_id    | UUID    | FK → users.id                      |
| delivered_at | Time    | Timestamp                          |
| eta_minutes  | Int     | ETA chosen                         |

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm/yarn
- Firebase CLI (if deploying via Firebase)
- Supabase project (with tables above created)

### Setup
```bash
# clone repo
git clone https://github.com/<your-username>/asap.git
cd asap

# install dependencies
npm install

# run locally
npm start
