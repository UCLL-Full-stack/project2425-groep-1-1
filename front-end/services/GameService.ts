const getAllGames = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser') as string)?.token,
        },
    });
};

const getCategoryByGameId = async ({ id }: { id: string }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + `/categories/game/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser') as string)?.token,
        },
    });
}

const getGameById = async ({ id }: { id: string }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + `/games/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser') as string)?.token,
        },
    });
}

const GameService = {
    getAllGames,
    getCategoryByGameId,
    getGameById
};

export default GameService;
