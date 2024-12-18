import database from '../util/database';
import { SpeedrunEvent } from "../model/speedrun_event";

const getAllSpeedrunEvents = async (): Promise<SpeedrunEvent[]> => {
    try {
        const speedRunEventPrismas = await database.speedrunEvent.findMany({
            include: { participants: true }
        });
        return speedRunEventPrismas.map((speedRunEventPrisma) => SpeedrunEvent.from(speedRunEventPrisma))
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

const getSpeedrunEventById = async ({ id }: { id: number}): Promise<SpeedrunEvent | null> => {
    try {
        const speedrunEventPrisma = await database.speedrunEvent.findUnique({
            where: { id },
            include: { participants: true },
        });
        return speedrunEventPrisma ? SpeedrunEvent.from(speedrunEventPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

const addSpeedrunEvent = async ({name, startDate, endDate, participants, createdAt, updatedAt}: SpeedrunEvent) => {
    try{
        const speedrunEventPrisma = await database.speedrunEvent.create({
            data: {
                name,
                startDate,
                endDate,
                participants: {
                    connect: participants.map((participant) => ({ id: participant.getId() }))
                },
            }, include: { participants: true },
        })
        return SpeedrunEvent.from(speedrunEventPrisma);
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

const updateSpeedrunEventParticipants = async (speedrunEvent: SpeedrunEvent) => {
    try {
        const speedrunEventPrisma = await database.speedrunEvent.update({
            where: { id: speedrunEvent.id },
            data: {
                participants: {
                    connect: speedrunEvent.participants.map((participant) => ({ id: participant.getId() }))
                },
            },
            include: { participants: true },
        });
        return speedrunEventPrisma ? SpeedrunEvent.from(speedrunEventPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

export default { getAllSpeedrunEvents, getSpeedrunEventById, addSpeedrunEvent, updateSpeedrunEventParticipants};