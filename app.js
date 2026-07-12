import express from 'express'; 
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import serviceRouter from './routes/serviceRoutes.js';
import userRouter from './routes/userRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import reservationRouter from './routes/reservationRoutes.js';
import AppError from './utils/AppError.js';
import bodyParser from "body-parser";
import cors from 'cors';
import webhookRouter from './routes/webhookRoutes.js'

const app = express();

// middlewares 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
	limit: 1000,
	message: 'Too many requests from this IP, please try again in an hour!', 
})

app.use(helmet());
app.use(hpp());
// Apply the rate limiting middleware to all requests.
app.use('/api', limiter);

// app.use(mongoSanitize());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('api/orders', reservationRouter);
app.use('api/v1/webhooks' , webhookRouter)
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;