import { Category } from '../model/category';
import gameDb from '../repository/game.db';

const categories: Category[] = [];

const getAllCategories = (): Category[] => categories;

const getCategoryById = (categoryId: number) => {
    return categories.find((category) => category.getId() === categoryId);
};

const getAllCategoriesForGame = (gameId: number) => {
    return categories.filter((category) => category.getGame().getId() === gameId);
};

const addCategory = (category: Category) => {
    categories.push(category);
};

const game1 = gameDb.getGameById(1);
if (!game1) {
    throw new Error(`Game with ID 1 not found.`); // Handle the case where the game is not found
}
const category1 = new Category({
    id: 1,
    name: 'Any%',
    description: 'Complete the game as fast as possible without restrictions.',
    game: game1,
});

addCategory(category1);

export default {
    getAllCategories,
    getAllCategoriesForGame,
    addCategory,
    getCategoryById,
};
