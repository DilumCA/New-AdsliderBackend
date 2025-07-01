import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongo } from "./utils/db.js";
import schemeRoutes from "./routes/scheme.routes.js";
import crypto from "crypto";
import newAdvertisementRoutes from "./routes/newadvertisement.routes.js";
import cropRoutes from "./routes/crop.routes.js";

dotenv.config();
const app = express();

// DB Connection
connectMongo();
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("Cloudinary Cloud Name :", process.env.CLOUDINARY_CLOUD_NAME);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://new-adslider-frontend.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
// Middleware to generate nonce and set CSP header
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.nonce = nonce; // Make nonce available to SSR if needed

  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self' 'nonce-${nonce}'; img-src 'self' blob: https://adslider-backend.vercel.app https://res.cloudinary.com https://internetusage.slt.lk data:; connect-src 'self' https://adslider-backend.vercel.app; frame-ancestors 'none'; form-action 'self';`
  );
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Web app is running....");
});

//scheme routes
app.use("/api/schemes", schemeRoutes);

// Advertisement routes
app.use("/api/newadvertisements", newAdvertisementRoutes);

//crop routes
app.use("/api", cropRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
