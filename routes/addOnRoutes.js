import express from "express";
import * as addOnController from "../controllers/addOnController.js";
const router = express.Router();

router
    .route("/")
    .get(addOnController.getAllAddOns)
    .post(addOnController.createAddOn);

router
    .route("/:id")
    .get(addOnController.getAddOn)
    .patch(addOnController.updateAddOn)
    .delete(addOnController.deleteAddOn);



export default router;