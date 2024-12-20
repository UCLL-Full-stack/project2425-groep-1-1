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
 *           format: date-time
 *           example: "2024-01-01T10:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T22:00:00Z"
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
 *     SpeedrunEventInput:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *       properties:
 *         name:
 *           type: string
 *           example: "Games Done Quick"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T10:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T22:00:00Z"
 *     SpeedrunEventAddParticipantsInput:
 *       type: object
 *       required:
 *         - speedrunEventId
 *         - userInputs
 *       properties:
 *         speedrunEventId:
 *           type: number
 *           format: int64
 *           example: 1
 *         userInputs:
 *           type: array
 *           items:
 *             type: number
 *             format: int64
 *             example: 1
 */



import express, { NextFunction, Request, Response } from 'express';
import speedrunEventService from '../service/speedrun_event.service'
import {SpeedrunEventAddParticipantsInput, SpeedrunEventInput} from "../types";

const speedrunEventRouter = express.Router();

/**
 * @swagger
 * /speedrun-events:
 *   get:
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
 * /speedrun-events:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new speedrun event.
 *     tags: [Speedrun Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpeedrunEventInput'
 *     responses:
 *       200:
 *         description: The new speedrun event.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpeedrunEvent'
 */
speedrunEventRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const speedrunEventInput = <SpeedrunEventInput>req.body;
    const speedrunEvent = await speedrunEventService.createSpeedrunEvent(speedrunEventInput);
    res.status(200).json(speedrunEvent);
  } catch (error) {
    next(error);
  }
})

/**
 * @swagger
 * /speedrun-events/add-participants:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add users to a speedrun event.
 *     tags: [Speedrun Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpeedrunEventAddParticipantsInput'
 *     responses:
 *       200:
 *         description: The speedrun event with the added users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpeedrunEvent'
 */
speedrunEventRouter.post('/add-participants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userInputs, speedrunEventId } = req.body as SpeedrunEventAddParticipantsInput;
    const result = await speedrunEventService.addParticipantsToSpeedrunEvent(userInputs, speedrunEventId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /speedrun-events/{eventId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a speedrun event by its ID.
 *     tags: [Speedrun Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the speedrun event to delete.
 *         schema:
 *           type: number
 *           format: int64
 *           example: 1
 *     responses:
 *       200:
 *         description: The result of the deletion operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Speedrun event deleted successfully."
 *                 deletedEventId:
 *                   type: number
 *                   format: int64
 *                   example: 1
 *       404:
 *         description: Speedrun event not found.
 *       500:
 *         description: An error occurred while deleting the speedrun event.
 */
speedrunEventRouter.delete('/:eventId', async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const { eventId } = req.params;
    const result = await speedrunEventService.deleteSpeedrunEvent(Number(eventId));
    res.status(200).json(result);
} catch (error) {
  next(error);
}
})

export { speedrunEventRouter };