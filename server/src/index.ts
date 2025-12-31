import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import progressRouter from './routes/progress';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Candy Match Game API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
