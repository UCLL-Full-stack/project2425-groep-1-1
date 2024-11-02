import { Game } from '../model/game';

const games: Game[] = [];

const getAllGames = (): Game[] => games;

const getGameById = (gameID: number) => {
    return games.find((game) => game.getId() === gameID);
};

const addGame = (game: Game) => {
    games.push(game);
};

const game1 = new Game({
    id: 1,
    name: 'Super Mario',
    genre: 'Platformer',
    description: 'A classic platforming game where you save the princess.',
    releaseDate: '1985-09-13',
});

addGame(game1);

export default {
    getAllGames,
    addGame,
    getGameById,
};
