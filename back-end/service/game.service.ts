import gameDb from '../repository/game.db';

const getAllGames = () => {
    return gameDb.getAllGames();
};

export default { getAllGames };
