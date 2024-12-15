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

const SpeedrunService = {
    postSpeedrun,
};

export default SpeedrunService;
