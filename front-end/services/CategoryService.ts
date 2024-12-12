import { Game } from '@types';

const getAllCategoriesByGameId = async ({ id }: { id: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/categories/game/' + id, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser') as string)?.token,
        },
    });
};

const CategoryService = {
    getAllCategoriesByGameId,
};

export default CategoryService;
