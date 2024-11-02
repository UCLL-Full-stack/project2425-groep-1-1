import { Game } from '../model/game';

const games: Game[] = [];

const getAllGames = (): Game[] => games;

const getGameById = (gameID: number) => {
    return games.find((game) => game.getId() === gameID);
};

const addGame = (game: Game) => {
    games.push(game);
};

export default {
    getAllGames,
    addGame,
    getGameById,
};
