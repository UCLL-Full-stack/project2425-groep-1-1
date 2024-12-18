import { SpeedrunInput } from '@types';

const postSpeedrun = async (speedrun: SpeedrunInput) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedruns', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
        body: JSON.stringify(speedrun),
    });
};

const validateSpeedrun = async ({ id, validatorId }: { id: number, validatorId: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedruns/validate/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('loggedInUser')!)?.token,
        },
        body: JSON.stringify({ id, validatorId })
    })
}

const getSpeedrunsForCategory = async ({ categoryId }: { categoryId: number }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/speedruns/category/' + categoryId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const SpeedrunService = {
    postSpeedrun,
    getSpeedrunsForCategory,
    validateSpeedrun,
};

export default SpeedrunService;
