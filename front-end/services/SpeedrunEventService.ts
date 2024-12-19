const getAllSpeedrunEvents = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedrun-events', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
    });
}

const addUserToSpeedrunEvent = async (userId: number, eventId: number) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedrun-events/add-participants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
        body: JSON.stringify({ userInputs: [userId], speedrunEventId: eventId }),
    });
}

const SpeedrunEventService = {
    getAllSpeedrunEvents,
    addUserToSpeedrunEvent,
};

export default SpeedrunEventService;