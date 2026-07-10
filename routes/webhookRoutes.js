import express from 'express';
import * as webhookController from '../controllers/webhookController'
const router = express.Router();

router
    .route('paypal')
    .post(express.raw({ type: "application/json" }) , webhookController.handlePaypalWebhook)

export default router