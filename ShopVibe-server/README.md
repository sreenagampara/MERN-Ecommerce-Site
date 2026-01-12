# ⚙️ ShopVibe Backend API

The robust server-side logic for **ShopVibe**, built with the Node.js/Express ecosystem. This API follows the **MVC (Model-View-Controller)** pattern to ensure scalability and clean code separation.

---

## 🛠️ Tech Stack & Architecture
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose (ODM)
- **Security:** JWT, Bcrypt, Express Rate Limit
- **Testing:** Jest
- **Media Management:** Cloudinary API



---

## 🔥 Key Backend Logic
- **Payment Pipeline:** Integrated **Razorpay** with backend-side order creation and cryptographic signature verification for secure transactions.
- **Authentication:** Custom JWT implementation with HttpOnly cookies for enhanced security against XSS.
- **File Handling:** Seamless image uploads to **Cloudinary** for product and profile management.
- **Email Service:** Automated transactional emails (OTP, Order Confirmation) via **Nodemailer**.

---

## 🛡️ Security Implementations
- **Rate Limiting:** Prevents brute-force attacks on sensitive routes (Login/Register).
- **Data Sanitization:** Against NoSQL injection and XSS.
- **Environment Safety:** Strict usage of `.env` for all private keys and credentials.

---

## ⚙️ Setup & Environment
Create a `.env` file in the `server` folder with the following:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Payments
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret

# Email (SMTP)
SMTP_USER=your_smtp_user
SENDER_EMAIL=your_verified_email
```

## Running Locally

npm install


npm run dev  # Starts server with Nodemon


npm test     # Runs Jest test suites

# Aurthor

# Sreekanth MR
