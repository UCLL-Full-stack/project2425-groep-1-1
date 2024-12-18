import { SpeedrunInput, SpeedrunValidationRequest } from '../types';
import speedrunDb from '../repository/speedrun.db';
import userDb from '../repository/user.db';
import gameDb from '../repository/game.db';
import categoryDb from '../repository/category.db';
import { Speedrun } from '../model/speedrun';

const getAllSpeedruns = () => {
    return speedrunDb.getAllSpeedruns();
};

const getSpeedrunsForCategory = ({ categoryId }: { categoryId: number }) => {
    return speedrunDb.getSpeedrunsForCategory({ categoryId });
}

const addSpeedrunSubmission = async ({userId, gameId, time, videoLink, categoryId}: SpeedrunInput) => {
    const user = await userDb.getUserById({ id: userId });
    const game = await gameDb.getGameById({ id: gameId });
    const category = await categoryDb.getCategoryById({ id: categoryId });

    const existingSpeedrun = await speedrunDb.getSpeedrunByVideoLink({ videoLink: videoLink })
    if (existingSpeedrun != null) {
        throw new Error("Can't submit the same speedrun twice.");
    }
    if (!user) {
        throw new Error('User not found.');
    }
    if (!game) {
        throw new Error('Game not found.');
    }
    if (!category) {
        throw new Error('Category not found.');
    } else {
        const newSpeedRun = new Speedrun({
            time: time,
            videoLink: videoLink,
            isValidated: false,
            speedrunner: user,
            game: game,
            category: category,
        });
        return speedrunDb.addSpeedrun(newSpeedRun);
    }
};

const validateSpeedrun = async ({ id, validatorId }: SpeedrunValidationRequest): Promise<Speedrun | null> => {
    if (!id) {
        throw new Error('Id is required.');
    }
    if (!validatorId) {
        throw new Error('ValidatorId is required.');
    }
    const speedrun = await speedrunDb.getSpeedrunById({ id });
    if (!speedrun) {
        throw new Error('Speedrun is not found.');
    }
    const validator = await userDb.getUserById({ id: validatorId });
    if (!validator) {
        throw new Error('Validator not found.');
    }

    speedrun.setIsValidated(true);
    speedrun.setValidator(validator);

    return await speedrunDb.updateSpeedrunValidation(speedrun)
};

export default {
    addSpeedrunSubmission,
    getAllSpeedruns,
    getSpeedrunsForCategory,
    validateSpeedrun,
};
