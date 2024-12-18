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
};

export default SpeedrunService;
