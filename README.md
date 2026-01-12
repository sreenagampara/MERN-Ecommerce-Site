# ShopVibe – MERN Stack E-Commerce Application

ShopVibe is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with authentication, user management, and secure API communication.

This repository contains both the frontend (React) and backend (Express) codebases.

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- **State Management:** React Context API / Redux Toolkit
- **Animations:** Framer Motion for smooth UI transitions
- **Payments:** Razorpay Integration (Test & Live)

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- **Security:** JWT (JSON Web Tokens), Bcrypt password hashing, and Express Rate Limit.
- **Communication:** Nodemailer for OTP and password recovery.
- **Media:** Cloudinary for image cloud storage.

---
## 🏗️ Project Structure


ShopVibe/


├── ShopVibe-Client/    # React + Vite Frontend


├── ShopVibe-server/    # Node.js + Express Backend


└── README.md           # Root Documentation


🚀 Key Features


Secure Auth: JWT-based authorization with HttpOnly cookies.

Robust API: Rate-limited endpoints to prevent Brute Force attacks.

User Management: Email verification & Password reset via SMTP.

Responsive Design: Mobile-first approach using Tailwind CSS.

Tested Code: Backend logic verified with Jest/Unit Tests.

# Installation & Setup

1.Clone the project: git clone [https://github.com/sreenagampara/MERN-Ecommerce-Site.git](https://github.com/sreenagampara/MERN-Ecommerce-Site.git)


2.Configure Environment Variables: 

3.Create a .env file in both client and server folders (see .env.example for keys).

# Run the Application:

npm install


npm run dev


# Author

Sreekanth MR


## Screenshot


<img width="1909" height="859" alt="Screenshot-homepage" src="https://github.com/user-attachments/assets/aceb8fb6-d73c-4eb3-9d20-6cadeddef4d6" />



<img width="1898" height="624" alt="Screenshot-homepage-1" src="https://github.com/user-attachments/assets/45d90e48-3f5f-47db-bcac-529dc1e00746" />
