// import Router from 'express'
// import {router} from "express/lib/application.js";
import express from 'express'
import {authCheck, handeValidationErrors} from "./index.js";
import {UserController} from '../controllers/index.js'
import {loginValidation, registerValidation} from "../validations/validations.js";

const router = express.Router()

router.post('/register', registerValidation, handeValidationErrors, UserController.register);
router.post('/login', loginValidation, handeValidationErrors, UserController.login);
router.post('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
// router.get('/refreshe', UserController.refresh);
router.patch('/update', authCheck, handeValidationErrors, UserController.update);

export default router