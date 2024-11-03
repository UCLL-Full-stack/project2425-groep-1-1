const getAllGames = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/games', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    });
};

const GameService = {
    getAllGames,
};

export default GameService;
