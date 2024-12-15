import gameDb from '../repository/game.db';

const getAllGames = () => {
    return gameDb.getAllGames();
};

const getGameById = (id: string) => {
    const idNumber = parseInt(id);
    return gameDb.getGameById({ id: idNumber });
}

export default { getAllGames, getGameById };
