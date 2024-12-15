import { SpeedrunInput } from '../types';
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
    const todaysDate = new Date();

    const existingSpeedrun = await speedrunDb.getSpeedrunByVideoLink({ videoLink: videoLink })
    if (existingSpeedrun != null) {
        console.log(existingSpeedrun)
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
            submitDate: todaysDate,
            videoLink: videoLink,
            isValidated: false,
            speedrunner: user,
            game: game,
            category: category,
        });
        return speedrunDb.addSpeedrun(newSpeedRun);
    }
};

export default { addSpeedrunSubmission, getAllSpeedruns, getSpeedrunsForCategory };
