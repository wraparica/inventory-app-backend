import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || config.port;

await connectDB();

app.listen(port, '0.0.0.0', () => {
  console.log(`Currency API server running on port ${port}`);
});