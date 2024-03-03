const { Router } = require('express');
const { check } = require("express-validator");
const authController = require('../controllers/authController');

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

const authRouter = Router();

const registrationValidation = [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password must be between 4 and 20 characters").isLength({ min: 4, max: 20 }),
];

authRouter.post("/registration", registrationValidation, authController.registration);
authRouter.post("/login", authController.login);

module.exports = authRouter;