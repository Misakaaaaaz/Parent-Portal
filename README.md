
# P42 Parent Portal

A web-based platform providing parents with insights into their child's academic performance, interests, and potential career paths.

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Backend Overview](#backend-overview)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Routes](#routes)
  - [Utilities](#utilities)
  - [Server Initialisation](#server-initialisation)
  - [Tests](#tests)
- [Frontend Overview](#frontend-overview)
  - [Components](#components)
  - [State Management](#state-management)
  - [Styles](#styles)
  - [Images and Icons](#images-and-icons)
  - [Services](#services)
- [Setup and Running](#setup-and-running)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It serves as a parent portal where parents can:

- View their child's academic performance.
- Monitor recent emotions and surveys.
- Explore recommended institutions and courses.
- Manage their account details.

## Project Structure

```bash
p42
├── backend                # Backend API and server logic
│   ├── config             # Database connection configuration
│   ├── controllers        # Route logic for the backend
│   ├── data               # Data initialization scripts
│   ├── models             # Mongoose models (schemas) for MongoDB collections
│   ├── routes             # Express routes to handle HTTP requests
│   ├── tests              # Unit tests for backend logic
│   ├── utils              # Utility functions (authentication, etc.)
│   ├── server.js          # Main entry point for the backend server
│   └── app.js             # Express app configuration and middleware setup
├── frontend               # Frontend React application
│   ├── public             # Static files such as HTML, icons, etc.
│   ├── src                # React components, state management, styles, services
│   ├── services           # API service logic
│   └── styles             # CSS styles for various components
└── README.md              # Project documentation
```

## Backend Overview

### Models
- **User Model (`models/userModel.js`)**: Defines schema for users (authentication and profile).
- **Student Model (`models/Student.js`)**: Represents student data, linked to their parents.
- **Institution Model (`models/Institution.js`)**: Details of educational institutions and courses offered.
- **Course Model (`models/Course.js`)**: Schema for courses offered by institutions.
- **Event Model (`models/Event.js`)**: Represents student-related events (exams, activities).
- **CareerField Model (`models/CareerField.js`)**: Stores recommended and not recommended career paths for students.

### Controllers
- **Student Controller (`controllers/studentController.js`)**: Manages student data, including fetching and manipulating student records.

### Routes
- **User Routes (`routes/userRouter.js`)**: Handles authentication, user profile management, and registration.
- **Student Routes (`routes/studentRoutes.js`)**: Manages endpoints for retrieving student data and institutions.
- **Event Routes (`routes/eventRoutes.js`)**: Handles events related to students.
- **Career Field Routes (`routes/careerFieldRoutes.js`)**: Manages career recommendations for students.
- **API Routes (`routes/api.js`)**: Provides generic endpoints for handling academic data.

### Utilities
- **isAuth (`utils/isAuth.js`)**: Middleware for authentication checks, ensuring protected routes are accessed by authenticated users.
- **Utils (`utils/utils.js`)**: Contains helper functions used across the backend.

### Server Initialisation
- **server.js**: The main entry point for starting the backend server. Connects to MongoDB and sets up the Express app.
- **app.js**: Configures middleware, including JSON parsing and routes, for the Express application.

### Tests
- **Unit Tests (`tests/`)**: Test coverage for the backend, including `server_test.js`, `userRouter_test.js`, and `utils_test.js`.

## Frontend Overview

### Components
- **Main Components**:
  - **AcademicPerformance (`components/AcademicPerformance.js`)**: Displays student's academic data in chart form.
  - **CareerOrientation (`components/CareerOrientation.js`)**: Shows recommended and not recommended careers.
  - **Calendar (`components/Calendar.js`)**: Displays upcoming student events in a calendar view.
  - **StudentOverview (`components/StudentOverview.js`)**: Presents a summary of the student's basic information.
  - **EmotionWidget (`components/EmotionWidget.js`)**: Displays recent emotions of the student.

- **Account Components**:
  - **SigninScreen (`SigninScreen.js`)**: User login interface.
  - **Profile (`Profile.js`)**: Allows users to view and update their profile information.

- **Navigation**:
  - **Navigation (`Navigation.js`)**: Navigation bar for navigating between different sections of the application.

### State Management
- **Actions (`actions/`)**: Defines actions for managing user and child state (e.g., `userActions.js`, `childActions.js`).
- **Reducers (`reducers/`)**: Defines how state updates in response to actions (e.g., `userReducers.js`, `childReducers.js`).
- **Store (`store.js`)**: Configures Redux store with reducers and middleware.

### Styles
CSS styles for individual components and overall application UI:
- **Institution Styles**: `InstitutionStyle.css`, `InstitutionWidget.css`
- **Survey Styles**: `Survey.css`, `AllSurveypages.css`
- **Emotion Widget Styles**: `EmotionWidget.css`
- **Calendar Styles**: `Calendar.css`

### Images and Icons
The application uses various icons and images to represent career paths, emotions, and users:
- **Icons**: `career/icons/*.png` for career paths like business, law, and veterinary science.
- **Profile Pictures**: `images/*.png` for user avatars (e.g., `alex-nguyen.png`, `sarah-chen.png`).

### Services
- **Student Data Service (`services/studentData.js`)**: Contains logic for making API requests to the backend to fetch student data.

## Setup and Running

### Prerequisites
- Node.js (v12 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- npm or yarn

### Installation

**Clone the repository**
```bash
git clone https://bitbucket.org/soft3888-m08-01-p42/p42/src/main/
cd p42
```

**Install Backend Dependencies**
```bash
cd backend
npm install
```

**Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Configure Environment Variables

Create a `.env` file in the backend directory. Add your MongoDB connection string and any other necessary environment variables:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

**Start the Application (Backend and Frontend)**
```bash
npm run dev
```
This command will start both the backend server and the frontend development server simultaneously:

- The backend server will run on `http://localhost:5000`.
- The frontend will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with descriptive messages.
4. Open a pull request to the main branch.

## License

This project is licensed under a proprietary license. All rights are reserved by the client. Unauthorized copying, modification, distribution, or any form of usage without prior permission from the client is strictly prohibited.
