/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SpeedrunEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           example: 1
 *         name:
 *           type: string
 *           example: "Games Done Quick"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
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
 *         - id
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           example: 1
 *     SpeedrunEventInput:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           example: 1
 *     SpeedrunEventAddParticipantsInput:
 *       type: object
 *       required:
 *         - speedrunEventInput
 *         - userInputs
 *       properties:
 *         speedrunEventInput:
 *           $ref: '#/components/schemas/SpeedrunEventInput'
 *         userInputs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserInput'
 */



import express, { NextFunction, Request, Response } from 'express';
import speedrunEventService from '../service/speedrun_event.service'
import { SpeedrunEventAddParticipantsInput } from "../types";

const speedrunEventRouter = express.Router();

/**
 * @swagger
 * /speedrun-events:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all speedrun events
 *     tags: [Speedrun Events]
 *     responses:
 *       200:
 *         description: A list of speedrun events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/SpeedrunEvent'
 */
speedrunEventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const speedrunEvents = await speedrunEventService.getAllSpeedrunEvents();
    res.status(200).json(speedrunEvents);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /speedrun-events/add-participants:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add users to a speedrun event.
 *     tags: [Speedrun Events]
 *     responses:
 *       200:
 *         description: The speedrun event with the added users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpeedrunEventAddParticipantsInput'
 */
speedrunEventRouter.post('/add-participants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const speedrunEventAddParticipantsInput = <SpeedrunEventAddParticipantsInput>req.body;
    const result = await speedrunEventService.addParticipantsToSpeedrunEvent(speedrunEventAddParticipantsInput);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { speedrunEventRouter };