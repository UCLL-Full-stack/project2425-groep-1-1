import { SpeedrunEvent } from "@types";

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

const addSpeedrunEvent = async (speedrunEventInput: SpeedrunEvent) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedrun-events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
        body: JSON.stringify(speedrunEventInput),
    });
}

const deleteSpeedrunEvent = async (eventId: number) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speedrun-events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
    });
}

const SpeedrunEventService = {
    getAllSpeedrunEvents,
    addUserToSpeedrunEvent,
    addSpeedrunEvent,
    deleteSpeedrunEvent
};

export default SpeedrunEventService;