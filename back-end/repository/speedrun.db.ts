import { Speedrun } from '../model/speedrun';

const speedruns: Speedrun[] = [];

const getAllSpeedruns = (): Speedrun[] => speedruns;

const addSpeedrun = (speedrun: Speedrun) => {
    speedruns.push(speedrun);
};

export default {
    getAllSpeedruns,
    addSpeedrun,
};
