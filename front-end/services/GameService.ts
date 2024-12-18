const getAllGames = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getGameById = async ({ id }: { id: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const GameService = {
    getAllGames,
    getGameById,
};

export default GameService;
