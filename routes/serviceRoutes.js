import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import * as authController from '../controllers/authController.js';
import * as reservationController from '../controllers/reservationController.js';
const router = express.Router();

router
    .route('/')
    .get(serviceController.getAllServices)
    .post(authController.protect , authController.restrictTo('admin'), serviceController.createService);
router
    .route('/:id')
    .get(serviceController.getService)
    .patch(authController.protect, authController.restrictTo('admin'), serviceController.updateService)
    .delete(authController.protect, authController.restrictTo('admin'), serviceController.deleteService);


export default router;