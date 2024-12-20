import { Speedrun } from '../model/speedrun';
import database from "../util/database";

const getAllSpeedruns = async (): Promise<Speedrun[]> => {
    try {
        const speedrunPrismas = await database.speedrun.findMany({
            include: {
                validator: true,
                speedrunner: true,
                game: true,
                category: { include: { game: true }},
            },
        });
        return speedrunPrismas.map((speedrunPrisma) => Speedrun.from(speedrunPrisma));
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const getSpeedrunsForCategory = async ({ categoryId }: { categoryId: number }) => {
    try {
        const speedrunPrimas = await database.speedrun.findMany({
            where: { category: { id: categoryId } },
            include: {
                validator: true,
                speedrunner: true,
                game: true,
                category: { include: { game: true }},
            },
        });
        return speedrunPrimas.map((speedrunPrisma) => Speedrun.from(speedrunPrisma));
    } catch (error) {
        throw new Error("Database error, see console for more information.");
    }
}

const getSpeedrunById = async ({ id }: { id: number }) => {
    try {
        const speedrunPrisma = await database.speedrun.findUnique({
            where: { id },
            include: {
                validator: true,
                speedrunner: true,
                game: true,
                category: { include: { game: true }},
            }
        });
        return speedrunPrisma ? Speedrun.from(speedrunPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

const getSpeedrunByVideoLink = async ({ videoLink }: { videoLink: string }): Promise<Speedrun | null> => {
    try {
        const speedrunPrisma = await database.speedrun.findFirst({
            where: { videoLink },
            include: {
                validator: true,
                speedrunner: true,
                game: true,
                category: { include: { game: true }},
            },
        });
        return speedrunPrisma ? Speedrun.from(speedrunPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const addSpeedrun = async ({time, submitDate, videoLink, isValidated, speedrunner, validator, game, category}: Speedrun) => {
    try {
        const speedrunPrisma = await database.speedrun.create({
            data: {
                time,
                submitDate,
                videoLink,
                isValidated,
                speedrunner: { connect: { id: speedrunner.id }},
                game: { connect: { id: game.id }},
                category: { connect: { id: category.id }},
            },
            include: {
                validator: true,
                speedrunner: true,
                game: true,
                category: { include: { game: true }},
            },
        })
        return Speedrun.from(speedrunPrisma);
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const updateSpeedrunValidation = async (speedrun: Speedrun) => {
    try {
        const speedrunPrisma = await database.speedrun.update({
            where: { id: speedrun.id },
            data: {
                isValidated: speedrun.isValidated,
                validator: { connect: { id: speedrun.validator!.id! }},
            },
            include: {
                validator: true,
                speedrunner: true,
                game: true,
                category: { include: { game: true }},
            },
        });
        return speedrunPrisma ? Speedrun.from(speedrunPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

export default {
    getAllSpeedruns,
    getSpeedrunsForCategory,
    getSpeedrunById,
    getSpeedrunByVideoLink,
    addSpeedrun,
    updateSpeedrunValidation,
};
