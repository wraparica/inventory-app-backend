import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

import { config } from './config/index.js';
import inventoryRoutes from './routes/inventoryAuth.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { originGuard } from './middleware/originGuard.js';
import { currencyRateLimiter } from './middleware/rateLimiter.js';

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://wraparica.github.io",
];
app.set('trust proxy', 1);
app.use(helmet());


app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(cookieParser());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api', originGuard, currencyRateLimiter, inventoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;