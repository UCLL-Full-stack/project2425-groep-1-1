import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';

const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput = <UserInput>req.body;
    const response = await userService.authenticate(userInput);
    res.status(200).json({ message: 'Authentication succesful', ...response });
  } catch (error) {
    next(error);
  }
});

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