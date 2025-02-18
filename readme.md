<h1>Exam Portal</h1>

The Exam Portal is a fully-functional web-based examination system designed to streamline the process of conducting online exams, tracking student performance, and providing detailed analytics for both students and administrators. The platform supports student registrations, secure exam-taking, adaptive questioning, and comprehensive post-exam analysis.

## Features  

- **Student Registration:** Secure signup and authentication.  
- **Exam Registration:** Admins manage slots; students register.  
- **Booking & Fees:** Online fee payment (no gateway yet).  
- **Date Rescheduling:** Students request; admin's decision is final.  
- **Secure Exam Start:** Photo/ID verification (in progress).  
- **Quit & Disconnection Handling:** Resume exams after disconnection; next-day continuation (in progress).  
- **Adaptive Questioning:** Dynamic difficulty based on performance (in progress).  
- **Post-Exam Evaluation:** Instant answer evaluation and detailed reports.  
- **Strengths & Weakness Dashboard:** Individual and overall performance insights.  
- **Percentile Calculation:** Ranking based on overall performance.  
- **Time Tracking:** Tracks time per question for analysis.  
- **Post-Exam Question Review:** Evaluates question effectiveness and difficulty.  
- **Dashboard Updates:** Adjusts question difficulty based on trends (in progress).


## Tech Stacks

**Client:** ReactJS, TailwindCSS, Basic CSS

**Server:** NodeJS, Express

**Database:** MySQL


## Installation

### Dependencies
- Install [XAMPP](https://www.apachefriends.org/index.html) (or MySQL Server)
- Install [Node.js](https://nodejs.org/)


## Steps to Run Locally

**Clone the project**

```bash
  git clone https://link-to-project
```

**Go to the project directory**

```bash
  cd my-project
```
**Download the db_setup.sql file from project directory**
```bash
├───db_setup.sql
├───readme.md
├───backend/
└───frontend/
```

**Install dependencies in frondend and backend folders**

```bash
  npm install
```
### Setup the MySQL Database
- **Start MySQL Server** <br>
If you are using XAMPP, open the XAMPP Control Panel and start Apache & MySQL. <br>
If you are using MySQL Server, ensure it’s running.
- **Create the Database**  <br>
Open (http://localhost/phpmyadmin/) if using XAMPP
```sql
CREATE DATABASE exam_system;
```
- **Import the Database Schema**
1)  Select the exam_system database.
2)  Click on the Import tab.
3)  Choose the db_setup.sql file.
4)  Click Go to execute the SQL script.

- **If using MySQL CLI, run:**
```sh
mysql -u root -p exam_db < path/to/db_setup.sql
```
- **Start the server**

```bash
  cd backend
  node server.js
```
- **Start the react app**

```bash
  cd frontend
  npm start
```

## Project Architecture

**Folders :**
```bash
├───db_setup.sql
├───readme.md
│
├───backend
│   │   package-lock.json
│   │   package.json
│   │   server.js
│   │
│   ├───config
│   │       db.js
│   │
│   └───routes
│           Admin.js
│           examRoutes.js
│           Student.js
│
└───frontend
    │   .gitignore
    │   package-lock.json
    │   package.json
    │   README.md
    │
    ├───public
    │       favicon.ico
    │       index.html
    │       logo192.png
    │       logo512.png
    │       manifest.json
    │       robots.txt
    │
    └───src
        │   App.css
        │   App.js
        │   App.test.js
        │   index.css
        │   index.js
        │   register.css
        │   Register.js
        │   reportWebVitals.js
        │   setupTests.js
        │
        ├───admin
        │       Add.js
        │       admin.css
        │       AdminDashboard.js
        │       Request.js
        │       
        └───student
            │   Login.js
            │   portal.css
            │   Portal.js
            │   reschedule.css
            │   Reschedule.js
            │
            ├───components
            │       Dashboard.css
            │       Dashboard.js
            │       Navbar.css
            │       Navbar.js
            │
            └───pages
                    Analysis.js
                    Results.css
                    Results.js
``` 