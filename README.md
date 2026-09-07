# Real Estate CRM

A full-stack Real Estate CRM built using the MERN Stack. This application helps real estate organizations manage customer leads, sales employees, projects, buildings, property units, follow-ups, and bookings with secure role-based authentication.

---

## Features

### Authentication

- JWT Authentication
- Role-Based Access Control
- Secure Password Hashing
- Protected Routes
- Admin and Sales Employee Login

### Admin

- Create Sales Employee Accounts
- View Dashboard
- Manage Leads
- Assign Leads to Sales Employees
- Manage Projects
- Manage Property Units
- View Bookings
- Manage Lead Status
- Track Follow-Up Dates

### Sales Employee

- View Sales Dashboard
- View Assigned Leads
- Create Leads
- Edit Leads
- Search Leads
- Filter Leads by Status
- Add Customer Notes
- Manage Follow-Up Dates
- View Available Properties
- Create Property Bookings
- View Bookings

### Lead Management

- Create Leads
- View Leads
- Edit Leads
- Delete Leads
- Search Leads by Name, Phone or Email
- Filter Leads by Status
- Assign Leads to Sales Employees
- Add Notes
- Add Follow-Up Dates

### Lead Stages

- New
- Contacted
- Site Visit
- Interested
- Negotiation
- Booked
- Lost

### Property Management

- Create Projects
- View Projects
- Edit Projects
- Delete Projects
- Manage Buildings
- Create Property Units
- View Property Units
- Edit Property Units
- Delete Property Units
- Manage Unit Availability
- Store Unit Type and Price

### Booking Management

- Connect Leads with Property Units
- Create Property Bookings
- View Bookings
- Check Unit Availability
- Update Unit Status after Booking
- Prevent Duplicate Bookings

### Double Booking Protection

- Check whether the selected unit exists
- Check whether the unit is already booked
- Check whether an existing booking exists for the unit
- Prevent multiple leads from booking the same unit
- Update unit status after successful booking

### Dashboard

- Total Leads
- Lead Status Information
- Follow-Up Information
- Booking Information
- Sales Overview
- Recent Sales Information

### Validation

- Required Field Validation
- Customer Name Validation
- Phone Number Validation
- Email Validation
- Budget Validation
- Project Validation
- Unit Validation
- Property Price Validation
- Booking Validation

### Responsive Design

- Responsive Admin Dashboard
- Responsive Sales Dashboard
- Responsive Sidebar
- Responsive Forms
- Responsive Tables
- Mobile Navigation
- Tablet Support
- Desktop Support

---

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Tailwind CSS
- lucide-react
- Vite
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Database

- MongoDB Atlas

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

---

## Demo Credentials

### Admin

```bash
Email: recrmadmin@gmail.com
Password: RECRM_Admin
```

### Employee
```bash
Email : arun@gmail.com
Password: arun@123

Email : surya@gmail.com
Password: surya@123