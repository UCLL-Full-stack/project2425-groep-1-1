import express, { NextFunction, Request, Response } from 'express';
import speedrunService from '../service/speedrun.service';
import { SpeedrunInput } from '../types';

const speedrunRouter = express.Router();

speedrunRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speedrunInput: SpeedrunInput = req.body;
        const speedrunSubmission = await speedrunService.addSpeedrunSubmission(speedrunInput);
        res.status(200).json(speedrunSubmission);
    } catch (error) {
        next(error);
    }
});

export { speedrunRouter };
