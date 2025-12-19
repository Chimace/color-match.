import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import progressRoutes from './routes/progress';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
    res.send('Candy Match Game API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
