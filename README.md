## Jerry's Budget Planner App

### Overview
Jerry's Budget Planner is a full-stack web application designed to help users track income, expenses, and recurring bills. It provides insightful reports, customizable financial targets, and automated email notifications for bill reminders.

### Tech Stack
- Frontend: React with multiple UI and utility libraries
- Backend: ASP.NET Core (REST API with 4 controllers and 7 models)
- Database: MySQL (with events, procedures, and triggers, 7 tables)
- Automation: Python script for sending automatic emails

## Features

### 📊 Dashboard
![Screenshot 2025-02-17 185235](https://github.com/user-attachments/assets/01020fa0-408f-4431-9a31-1b95484213fb)
![Screenshot 2025-02-17 185317](https://github.com/user-attachments/assets/ade16505-9099-4fa2-b10c-f6bd624d52a4)
![Screenshot 2025-02-17 185326](https://github.com/user-attachments/assets/c0474dd3-3dfe-480e-8484-a7e8961749a0)

- Annual financial summary (Income/Expense/Target)
- Monthly target progress bar
- Expense addition form with category/date/amount
![Screenshot 2025-02-17 185302](https://github.com/user-attachments/assets/2a281716-a1cc-4c9f-8739-ecd8e74e9752)
- Interactive time-period line graph (3M/6M/1Y/5Y/All)
- Expense history table with delete functionality

### 📈 Reports
![Screenshot 2025-02-17 185339](https://github.com/user-attachments/assets/6157440d-a545-43f8-ba47-254647b7c2ab)
1. **Expense Distribution** - Donut chart by category
3. **Category Trends** - Multi-category line charts
4. **Historical Analysis** - Custom time-period comparisons
   

### 💸 Bill Management
![Screenshot 2025-02-17 185415](https://github.com/user-attachments/assets/7db0b3df-1b99-47d2-8def-51a39dda4266)
![Screenshot 2025-02-17 185424](https://github.com/user-attachments/assets/0436458a-88f1-4cf7-ab8a-b7d9b37f9b3d)
![Screenshot 2025-02-17 185436](https://github.com/user-attachments/assets/62a491e2-0cfc-4be4-9767-fbdd68df6e90)

- Recurring bills display with card details
- Upcoming bills management (postpone/mark paid)
- New bill form with notification pref
erences
- Scheduled email composition
- Bill history table with filters

### ⚙️ Customization
![Screenshot 2025-02-17 185448](https://github.com/user-attachments/assets/63ff23d1-b1b2-4470-9c75-71d464c79d4e)
- Adjust annual income targets
- Modify monthly expense goals
- Configure financial year settings


*Python Script*
Sends automatic email notifications for scheduled bills
![Screenshot 2025-02-17 185529](https://github.com/user-attachments/assets/1ead397c-5eb4-433b-bd73-5606123600d4)


*Database (MySQL)*
Uses tables, events, procedures, and triggers for automation
Ensures data consistency and integrity
![Screenshot 2025-02-17 185705](https://github.com/user-attachments/assets/697f4877-421b-4899-afdb-fdaa2d53436f)

*Server-Side (ASP.NET Core Backend)*
REST API with 4 controllers and 7 models
Handles authentication, data management, and business logic
![Screenshot 2025-02-17 190014](https://github.com/user-attachments/assets/bf9c6823-1151-46e7-8270-80b536261527)


*Project Structure*
budgetplanner/
├── client/               # React Application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Main application views
│   │   ├── stylesheets/  # CSS/SCSS files
│   │   └── external/     # Third-party integrations
│
├── server/               # ASP.NET API
│   ├── Controllers/
│   ├── Models/
│   └── appsettings.json
│
├── database/             # MySQL scripts
│   ├── schema.sql
│   ├── triggers.sql
│   └── procedures.sql
│
└── scripts/              # Python automation
    ├── scheduled_emails.py
    └── requirements.txt


