const getAllGames = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
    });
};

const getGameById = async ({ id }: { id: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
    });
};

const GameService = {
    getAllGames,
};

export default GameService;
