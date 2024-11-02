import { Speedrun } from '../model/speedrun';

const speedruns: Speedrun[] = [];

const getAllSpeedruns = (): Speedrun[] => speedruns;

const addSpeedrun = (speedrun: Speedrun) => {
    speedruns.push(speedrun);
    return speedrun;
};

export default {
    getAllSpeedruns,
    addSpeedrun,
};
