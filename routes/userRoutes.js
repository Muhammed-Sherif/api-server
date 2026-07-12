import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router
    .route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(authController.protect, userController.getUser)
    .patch(authController.protect, userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

export default router;
