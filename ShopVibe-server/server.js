import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import ordertRouter from "./routes/orderRoutes.js";
import producRouter from "./routes/productRoutes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import AdminJSExpress from "@adminjs/express";
import adminJs from "./admin/admin.js";
import { authenticate } from "./admin/adminAuth.js";
import uploadRouter from "./routes/uploadRoutes.js";
import adRoutes from "./routes/adRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT||500;
const MONGODB_URL = process.env.MONGODB_URL;
const FRONT_END_URL =process.env.FRONT_END_URL;



// ------------------ CORS ------------------

app.use(
  cors({
    
    origin:FRONT_END_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());


// ------------------ ADMINJS SESSION ------------------

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

// ------------------ ADMINJS ROUTER ------------------

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate,
    cookiePassword: process.env.ADMIN_COOKIE_SECRET,
  },
);

app.use(adminJs.options.rootPath, adminRouter);

// ------------------ BODY PARSERS ------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------ API ROUTES ------------------

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order",ordertRouter);
app.use("/api/product",producRouter);
app.use("/api/upload",uploadRouter)
app.use("/api/ad",adRoutes)


// ------------------ SIMPLE ENDPOINTS ------------------

app.get("/", (req, res) => {
  res.send(`<h1>Server is running on the port 5000<h1>`);
});


// ------------------ MONGODB CONNECTION ------------------

async function AdsDataBase() {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: "ShopVibe" });
    console.log("Monogo Db is woking");
    app.listen(PORT, "0.0.0.0", () => {
      console.log("server running the port :",PORT);
    });
  } 
  catch (error) {
    console.log("error message", error);
    process.exit(1);
  }
}
AdsDataBase();
