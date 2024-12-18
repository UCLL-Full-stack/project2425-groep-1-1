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
 *           example: 1
 *         username:
 *           type: string
 *           example: "PlayerOne"
 *         email:
 *           type: string
 *           example: "playerone@example.com"
 *         password:
 *           type: string
 *           example: "securepassword123"
 *         signUpDate:
 *           type: string
 *           example: "2024-01-01"
 *         role:
 *           type: string
 *           example: "user"
 *
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Super Mario"
 *         genre:
 *           type: string
 *           example: "Platformer"
 *         description:
 *           type: string
 *           example: "A classic platforming game where you save the princess."
 *         releaseDate:
 *           type: string
 *           example: "1985-09-13"
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Any%"
 *         description:
 *           type: string
 *           example: "Complete the game as fast as possible without restrictions."
 *         game:
 *           $ref: '#/components/schemas/Game'
 *
 *     SpeedrunInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           example: 1
 *         gameId:
 *           type: number
 *           example: 1
 *         categoryId:
 *           type: number
 *           example: 1
 *         time:
 *           type: number
 *           example: 123.45
 *         videoLink:
 *           type: string
 *           example: "http://example.com/speedrun-video"
 *
 *     Speedrun:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         time:
 *           type: number
 *           example: 123.45
 *         submitDate:
 *           type: string
 *           example: "2024-11-02"
 *         videoLink:
 *           type: string
 *           example: "http://example.com/speedrun-video"
 *         isValidated:
 *           type: boolean
 *           example: false
 *         speedrunner:
 *           $ref: '#/components/schemas/User'
 *         game:
 *           $ref: '#/components/schemas/Game'
 *         category:
 *           $ref: '#/components/schemas/Category'
 */


import express, { NextFunction, Request, Response } from 'express';
import speedrunService from '../service/speedrun.service';
import { SpeedrunInput } from '../types';

const speedrunRouter = express.Router();

/**
 * @swagger
 * /speedruns:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Submit a new speedrun
 *     tags: [Speedruns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpeedrunInput'
 *     responses:
 *       "200":
 *         description: Speedrun successfully submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speedrun'
 *       "400":
 *         description: Bad Request
 *       "500":
 *         description: Internal Server Error
 */
speedrunRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speedrunInput: SpeedrunInput = req.body;
        const speedrunSubmission = await speedrunService.addSpeedrunSubmission(speedrunInput);
        res.status(200).json(speedrunSubmission);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /speedruns:
 *   get:
 *     summary: Get a list of all speedruns.
 *     tags: [Speedruns]
 *     responses:
 *       "200":
 *         description: A JSON consisting of an array of speedrun objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Speedrun'
 *       "400":
 *         description: Bad Request
 *       "500":
 *         description: Internal Server Error
 */
speedrunRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speedruns = await speedrunService.getAllSpeedruns();
        res.status(200).json(speedruns);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /speedruns/category/{categoryId}:
 *   get:
 *     summary: Get a list of speedruns for a given category.
 *     tags: [Speedruns]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to fetch speedruns for.
 *     responses:
 *       "200":
 *         description: A JSON consisting of an array of speedrun objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Speedrun'
 *       "400":
 *         description: Bad Request.
 *       "500":
 *         description: Internal Server Error.
 */
speedrunRouter.get('/category/:categoryId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speedruns = await speedrunService.getSpeedrunsForCategory({ categoryId: Number(req.params.categoryId) });
        res.status(200).json(speedruns);
    } catch (error) {
        next(error);
    }
})
export { speedrunRouter };
