import { Game } from '../model/game';
import database from '../util/database';

const getAllGames = async (): Promise<Game[]> => {
    try {
        const gamePrismas = await database.game.findMany();
        return gamePrismas.map((gamePrisma) => Game.from(gamePrisma));
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }

};

const getGameById = async ({ id }: { id: number }): Promise<Game | null> => {
    try {
        const gamePrisma = await database.game.findUnique({ where: { id } });
        return gamePrisma ? Game.from(gamePrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const addGame = async ({id, name, genre, description, releaseDate }: Game): Promise<Game> => {
    try {
        const gamePrisma = await database.game.create({
            data: {
                id,
                name,
                genre,
                description,
                releaseDate,
            }
        });
        return Game.from(gamePrisma);
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }

};

export default {
    getAllGames,
    addGame,
    getGameById,
};
