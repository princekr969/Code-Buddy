import "./config/env.js";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    process.env.DEVELOPMENT_FRONTEND_URL, 
    process.env.PRODUCTION_FRONTEND_URL  
];
  
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


// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);

// mongodb connection
mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>
{
    app.listen(PORT, ()=>
    {
        console.log(`Server is live on port ${PORT}!`);
    })
})
.catch((err)=>
{
    console.log(err);
})