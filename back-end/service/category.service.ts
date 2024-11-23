import categoryDb from '../repository/category.db';

const getAllCategoriesForGame = ({ gameId }: {gameId: number}) => {
    return categoryDb.getAllCategoriesForGame({ gameId });
};

export default { getAllCategoriesForGame };
