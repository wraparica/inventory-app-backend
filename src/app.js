import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config/index.js';
import inventoryRoutes from './routes/inventoryAuth.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { originGuard } from './middleware/originGuard.js';
import { currencyRateLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api', originGuard, currencyRateLimiter, inventoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;