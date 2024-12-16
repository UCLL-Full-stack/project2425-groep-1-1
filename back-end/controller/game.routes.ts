/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all games.
 *     tags: [Games]
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

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a game by id.
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the game to fetch.
 *     responses:
 *       "200":
 *         description: A JSON consisting of a game object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       "400":
 *         description: Bad Request.
 *       "500":
 *         description: Internal Server Error.
 */
gameRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const game = await gameService.getGameById({ id: Number(req.params.id) })
        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
})

export { gameRouter };
