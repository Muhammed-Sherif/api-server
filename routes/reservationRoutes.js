import express from 'express';
import * as reservationController from '../controllers/reservationController.js';
import * as authController from '../controllers/authController.js';
const app = express();
const router = express.Router();
router
    .route('/:id/capture')
    .post(reservationController.captureOrder);

router
    .route('/')
    .get(authController.protect, reservationController.getAllReservations)
    .post(authController.protect, reservationController.createReservationForService);

router
    .route('/:id')
    .get(authController.protect, reservationController.getReservation)
    .patch(authController.protect , authController.restrictTo('admin'), reservationController.updateReservation)
    .delete(authController.protect,authController.restrictTo('admin'),reservationController.deleteReservation);
export default router;