import { Game } from '@types';

const getAllCategoriesForGame = async (game: Game) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const CategoryService = {
    getAllCategoriesForGame,
};

export default CategoryService;
