# UniFix - Campus Complaint Resolution System

UniFix is a full-stack MERN application that allows students to report campus-related issues and enables staff members to resolve them efficiently.

## 🚀 Features
- **Student Dashboard:** Submit complaints with building/room details and "Before" images.
- **Staff Dashboard:** Department-specific task queue with status management.
- **Public Feed:** Reddit-style upvoting system to highlight urgent campus issues.
- **Department Leaderboard:** Real-time ranking of campus departments based on student ratings.
- **Dark Mode UI:** A modern, professional interface built with Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Axios, Context API.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js.

## 📂 Project Structure
- `/client`: React frontend.
- `/server`: Node.js backend API.
- `/server/uploads`: Storage for before/after images.

## 🔧 Installation
1. Clone the repository.
2. Run `npm install` in both `/client` and `/server`.
3. Create a `.env` file in `/server` with `MONGO_URI` and `JWT_SECRET`.
4. Run `npm run dev` in the client and `node index.js` in the server.