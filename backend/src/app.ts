import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import esgRoutes from "./routes/esg";
import responsesRouter from "./routes/responses";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Allow multiple origins (localhost + Vercel)
const allowedOrigins = [
  "http://localhost:3000",
  "https://esg-platform-theta.vercel.app",
];

// Dynamic CORS handling
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/esg", esgRoutes);
app.use("/api/responses", responsesRouter);

app.get("/", (req, res) => res.send("API running"));

export default app;
