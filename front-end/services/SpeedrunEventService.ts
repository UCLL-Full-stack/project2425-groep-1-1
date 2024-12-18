
const getAllSpeedrunEvents = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedrun-events', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
    });
}

const SpeedrunEventService = {
    getAllSpeedrunEvents,
};

export default SpeedrunEventService;