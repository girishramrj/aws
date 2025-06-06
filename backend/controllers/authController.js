import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { validationResult, body } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "Secretkey";

// Validation middleware
const registerValidation = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Must include uppercase letter")
        .matches(/[a-z]/).withMessage("Must include lowercase letter")
        .matches(/[0-9]/).withMessage("Must include a number")
        .matches(/[!@#$%^&*]/).withMessage("Must include a special character")
];

const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
];

// Controller: Register
export const register = [
    ...registerValidation,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // For QueryTypes.SELECT, Sequelize returns the results directly
            const results = await db.query("SELECT * FROM creds WHERE email = :email OR username = :username", {
                replacements: { email, username },
                type: db.QueryTypes.SELECT
            });
            
            // Check if any users with the same email or username exist
            if (results && results.length > 0) {
                if (results.some(user => user.email === email)) return res.status(409).send("Email already exists");
                if (results.some(user => user.username === username)) return res.status(409).send("Username already taken");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query("INSERT INTO creds (username, email, password) VALUES (:username, :email, :password)", {
                replacements: { username, email, password: hashedPassword },
                type: db.QueryTypes.INSERT
            });
            
            res.status(201).send("User registered successfully");
        } catch (error) {
            next(error);
        }
    }
];

// Controller: Login
export const login = [
    ...loginValidation,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            // For QueryTypes.SELECT, Sequelize returns [results, metadata]
            const results = await db.query("SELECT * FROM creds WHERE email = :email", {
                replacements: { email },
                type: db.QueryTypes.SELECT
            });
            
            // Check if we have any results
            if (!results || results.length === 0) {
                return res.status(404).send("User not found");
            }

            // Get the first user from results
            const user = results[0];
            
            // Verify the user has a password field
            if (!user || !user.password) {
                console.error('User or password field is undefined:', user);
                return res.status(500).send("Invalid user data");
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).send("Invalid credentials");

            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            console.error('Login error:', error);
            next(error);
        }
    }
];
