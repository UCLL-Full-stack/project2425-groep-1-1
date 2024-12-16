const getAllCategoriesByGameId = async ({ id }: { id: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/categories/game/' + id, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
    });
};

const getCategoryById = async ({ id }:{ id: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/categories/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        }
    })
}

const CategoryService = {
    getAllCategoriesByGameId,
    getCategoryById,
};

export default CategoryService;
