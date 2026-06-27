import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

connectDB();

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use("/api/auth", userRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/ai', aiRoutes)

app.use('/uploads', express.static(path.join(__dirname, '/uploads'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    }
}));

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Backend started on port ${PORT}`));

export default app;