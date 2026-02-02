# Project Management System

A web-based **Project Management System** designed for academic institutions to efficiently manage projects, student groups, and guide assignments. The system provides role-based access for **Admin, Teacher, and Student**, ensuring secure and organized project workflows.

---

## User Management
- Three user roles: **Admin, Teacher, Student**
- Secure Login & Signup with form validation
- User details include:
  - Username
  - Password
  - User type (admin / teacher / student)
  - Department

---

## Admin Features
The Admin has full control over the system through a dedicated dashboard.

### 1. Add Project
- Create new projects with:
  - Project ID
  - Title
  - Description
  - Department
  - Guide (dropdown selection)
  - Due date
- Projects are stored in the database

### 2. Assign Project
- Select projects from existing list
- Assign projects to student groups
- Configure:
  - Group leader name
  - Department
  - Division
  - Group size (default: 3)
- Success popup shown after assignment

### 3. Create Group
- Create student groups with:
  - Group leader username
  - Department
  - Division
  - Group size
- Each group contains **exactly 3 students**

### 4. View Guide
- View table displaying:
  - Group leader names
  - Assigned project guide
- Guides can see groups assigned to them

### 5. View Assignments
- View all project assignments
- Displays:
  - Project title
  - Assigned group
  - Project status
  - Due date

### 6. Submitted Projects
- View all submitted projects
- Displays submission details for evaluation

---

## Teacher Features
- View only the student groups assigned to them
- Simple and clean dashboard for easy tracking

---

## Student Features
- View assigned project details
- Submit project work through the system

---

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB / MySQL
- **Frontend:** HTML, CSS, JavaScript

---

## Security
- Password hashing
- Session management
- Role-based access control

---

## Usage
- **Admin:** Manage projects, groups, assignments, and submissions
- **Teacher:** View assigned student groups
- **Student:** View and submit assigned projects

---

## License
This project is developed for academic and learning purposes.
