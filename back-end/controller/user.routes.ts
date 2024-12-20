/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           example: 1
 *         username:
 *           type: string
 *           example: "PlayerOne"
 *         email:
 *           type: string
 *           format: email
 *           example: "playerone@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "securepassword123"
 *         signUpDate:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         role:
 *           type: string
 *           example: "user"
 *     UserInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "PlayerOne"
 *         email:
 *           type: string
 *           format: email
 *           example: "playerone@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "securepassword123"
 *     AuthenticationRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "PlayerOne"
 *         password:
 *           type: string
 *           format: password
 *           example: "securepassword123"
 *     AuthenticationResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         username:
 *           type: string
 *           example: "PlayerOne"
 *         role:
 *           type: string
 *           example: "user"
 */



import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import {AuthenticationRequest, Role, UserInput} from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of containing the user or if the user is an Admin, a list of all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of containing the user or if the user is an Admin, a list of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as Request & { auth: { username: string; role: Role } };
    const { username, role } = request.auth;
    const users = await userService.getAllUsers({ username, role });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login using username/password. Returns an object with JWT token and username when successful.
 *     tags: [Users]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthenticationRequest'
 *     responses:
 *         200:
 *            description: The created user object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AuthenticationResponse'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput = <AuthenticationRequest>req.body;
    const response = await userService.authenticate(userInput);
    res.status(200).json({ message: 'Authentication succesful', ...response });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: The created user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput = <UserInput>req.body;
    const user = await userService.createUser(userInput);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

export { userRouter };