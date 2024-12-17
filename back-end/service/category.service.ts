import categoryDb from '../repository/category.db';

const getAllCategoriesForGame = ({ gameId }: {gameId: number}) => {
    return categoryDb.getAllCategoriesForGame({ gameId });
};

const getCategoryById = ({ id }: { id: number }) => {
    return categoryDb.getCategoryById({ id });
}

export default { getAllCategoriesForGame, getCategoryById };
