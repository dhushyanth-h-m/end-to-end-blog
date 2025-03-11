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

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if(!user) {
            return res.status(401).json({message: "Invalid token"});
        }

        req.user = user;
        next();
    } catch(error) {
        next(error);
    }
};

const authorize = (roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Unauthorized"});
        }

        next();
    };
};

// Routes
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);

module.exports = router;