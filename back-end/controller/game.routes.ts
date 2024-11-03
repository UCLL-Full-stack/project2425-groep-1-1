/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *             type: number
 *             example: 1
 *         name:
 *             type: string
 *             example: "Super Mario"
 *         genre:
 *             type: string
 *             example: "Platformer"
 *         description:
 *             type: string
 *             example: "A classic platforming game where you save the princess."
 *         releaseDate:
 *             type: string
 *             example: "1985-09-13"
 */

import express, { NextFunction, Request, Response } from 'express';
import gameService from '../service/game.service';

const gameRouter = express.Router();

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get a list of all games.
 *     responses:
 *       "200":
 *         description: A JSON consisting of an array of game objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       "400":
 *         description: Bad Request
 *       "500":
 *         description: Internal Server Error
 *
 */

gameRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await gameService.getAllGames();
        res.status(200).json(games);
    } catch (error) {
        next(error);
    }
});

export { gameRouter };
