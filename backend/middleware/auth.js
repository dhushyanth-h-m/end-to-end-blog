const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body }  = require('express-validator');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const validateRegistration = [
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body('name').notEmpty().withMessage("Name is required"),
];

const validateLogin = [
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').notEmpty().withMessage("Password is required"),
];

// Routes
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);

module.exports = router;