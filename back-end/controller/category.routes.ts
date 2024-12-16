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
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *             type: number
 *             example: 1
 *         name:
 *             type: string
 *             example: "Any%"
 *         description:
 *             type: string
 *             example: "Complete the game as fast as possible without restrictions."
 *         game:
 *             $ref: '#/components/schemas/Game'
 */

import express, { NextFunction, Request, Response } from 'express';
import categoryService from '../service/category.service';

const categoryRouter = express.Router();

/**
 * @swagger
 * /categories/game/{gameId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all categories for a game.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the game to fetch categories for
 *     responses:
 *       "200":
 *         description: A JSON consisting of an array of category objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       "400":
 *         description: Bad Request
 *       "500":
 *         description: Internal Server Error
 *
 */
categoryRouter.get('/game/:gameId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = parseInt(req.params.gameId);
        const categoriesForGame = await categoryService.getAllCategoriesForGame({ gameId });
        res.status(200).json(categoriesForGame);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a category by id.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to fetch.
 *     responses:
 *       "200":
 *         description: A JSON consisting of a category object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       "400":
 *         description: Bad Request.
 *       "500":
 *         description: Internal Server Error.
 */
categoryRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryService.getCategoryById({ id: Number(req.params.id) });
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
})

export { categoryRouter };
