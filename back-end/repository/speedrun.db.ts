import { Speedrun } from '../model/speedrun';

const speedruns: Speedrun[] = [];

const getAllSpeedruns = (): Speedrun[] => speedruns;

const getSpeedrunByVideoLink = (videoLink: string) => {
    const run = speedruns.find((speedrun) => speedrun.getVideoLink() === videoLink);
    if (run) {
        return run;
    } else {
        return null;
    }
};

const addSpeedrun = (speedrun: Speedrun) => {
    speedruns.push(speedrun);
    return speedrun;
};

export default {
    getAllSpeedruns,
    addSpeedrun,
    getSpeedrunByVideoLink,
};
