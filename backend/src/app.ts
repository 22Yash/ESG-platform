import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import esgRoutes from "./routes/esg";
import responsesRouter from "./routes/responses";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
);

app.use('/api/auth', authRoutes);
app.use("/esg", esgRoutes);
app.use("/api/responses", responsesRouter);


app.get('/', (req, res) => res.send('API running'));

export default app;
