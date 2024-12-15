import gameDb from '../repository/game.db';

const getAllGames = () => {
    return gameDb.getAllGames();
};

const getGameById = ({ id }: { id: number }) => {
    return gameDb.getGameById({ id });
}

export default { getAllGames, getGameById };
