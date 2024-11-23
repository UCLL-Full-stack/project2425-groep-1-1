import database from '../util/database';
import {SpeedrunEvent} from "../model/speedrun_event";
import {Speedrun} from "../model/speedrun";

const getAllSpeedrunEvents = async (): Promise<SpeedrunEvent[]> => {
    try{
        const speedRunEventPrismas = await database.speedrunEvent.findMany({
            include: {participants: true}
        });
        return speedRunEventPrismas.map((speedRunEventPrisma) => SpeedrunEvent.from(speedRunEventPrisma))
    }catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

const addSpeedRunEvent = async ({name, startDate, endDate, participants, createdAt, updatedAt}: SpeedrunEvent) => {
    try{
        const speedrunEventPrisma = await database.speedrunEvent.create({
            data: {
                name,
                startDate,
                endDate,
                createdAt,
                updatedAt,
            }, include: {participants: true},
        })
        return SpeedrunEvent.from(speedrunEventPrisma);
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

export default { getAllSpeedrunEvents, addSpeedRunEvent };