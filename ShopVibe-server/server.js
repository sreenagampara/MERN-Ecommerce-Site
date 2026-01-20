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
import adminRoutes from "./routes/adminRoutes.js";


import path from "path";
import { fileURLToPath } from "url";

import Product from "./models/productModel.js"
import Ad from "./models/adModel.js"
import { seedAdmin } from "./scripts/seedAdmin.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();
const PORT = process.env.PORT || 500;
const MONGODB_URL = process.env.MONGODB_URL;
const FRONT_END_URL = process.env.FRONT_END_URL;


// ------------------ CORS ------------------

app.use(
  cors({
    origin: [FRONT_END_URL],
    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.url.startsWith('/admin')) {
    console.log(`[Request] ${req.method} ${req.url}`);
    if (req.files) console.log('[Request] Files:', Object.keys(req.files));
    // Simple body log
    console.log('[Request] Body keys:', Object.keys(req.body || {}));
  }
  next();
});


// ------------------ ADMINJS SESSION ------------------




if (process.env.NODE_ENV === 'production') {
  app.use('/admin/frontend/assets', express.static(path.join(__dirname, '.adminjs/bundle')));
}

// ------------------ BODY PARSERS ------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------ API ROUTES ------------------

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", ordertRouter);
app.use("/api/product", producRouter);
app.use("/api/admin", adminRoutes);



// ------------------ SIMPLE ENDPOINTS ------------------

app.get("/", (req, res) => {
  res.send(`<h1>Server is running on the port 5000<h1>`);
});




// ------------------ ADS & PRODUCTS MOCK ------------------


app.get("/api/ads", async (req, res) => {
  try {
    const { division, section } = req.query;
    const filter = {};
    if (division) filter.division = division;
    if (section) filter.section = section;

    const ads = await Ad.find(filter);
    res.status(200).json(ads);
  } catch (err) {
    console.error("error fetching this ads", err);
    res.status(500).json({ message: "error fetching ads" });
  }
});


app.get("/api/products", async (req, res) => {
  try {
    const {
      q,
      category,
      division,
      subCategory,
      minPrice,
      maxPrice,
      page,
      limit
    } = req.query;

    const filter = {};

    if (q && q.trim()) {
      filter.$text = { $search: q };
    }
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (division) filter.division = division;

    // Price filtering
    if (minPrice || maxPrice) {
      filter.$expr = {
        $and: [
          minPrice
            ? { $gte: [{ $toDouble: "$price" }, Number(minPrice)] }
            : { $gte: [{ $toDouble: "$price" }, 0] },
          maxPrice
            ? { $lte: [{ $toDouble: "$price" }, Number(maxPrice)] }
            : { $lte: [{ $toDouble: "$price" }, 99999999] }
        ]
      };
    }


    let query = Product.find(filter, q ? { score: { $meta: "textScore" } } : {});

    if (q) {
      query = query.sort({ score: { $meta: "textScore" } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (page && limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    console.error("error fetching products details", error);
    res.status(500).json({ message: "error fetching products" });
  }
});

// ------------------ MONGODB CONNECTION ------------------

async function AdsDataBase() {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: "ShopVibe" });
    console.log("Monogo Db is woking");
    await seedAdmin();
    app.listen(PORT, "0.0.0.0", () => {
      console.log("server running the port :", PORT);
    });
  }
  catch (error) {
    console.log("error message", error);
    process.exit(1);
  }
}
AdsDataBase();
