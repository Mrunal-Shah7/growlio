import express from 'express';;
import userRoutes from './routes/user'
import { connectDB } from './utils/features';
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()


const MONGO_URI = process.env.MONGO_URI || " ";
export const JWT_SECRET = process.env.JWT_SECRET || " ";

const app = express();
app.use(express.json());

app.use(morgan('dev'))
connectDB(MONGO_URI)
app.use(cookieParser());
app.use(userRoutes)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});