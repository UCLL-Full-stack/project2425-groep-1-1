import { SpeedrunInput } from '../types';
import speedrunDb from '../repository/speedrun.db';
import userDb from '../repository/user.db';
import gameDb from '../repository/game.db';
import categoryDb from '../repository/category.db';
import { Speedrun } from '../model/speedrun';

const getAllSpeedruns = () => {
    return speedrunDb.getAllSpeedruns();
};

const addSpeedrunSubmission = (speedrunInput: SpeedrunInput) => {
    const user = userDb.getUserById(speedrunInput.userId);
    const game = gameDb.getGameById(speedrunInput.gameId);
    const category = categoryDb.getCategoryById(speedrunInput.categoryId);
    const todaysDate = new Date();
    const formattedDate = todaysDate.toISOString().split('T')[0];

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
            id: speedrunDb.getAllSpeedruns().length + 1,
            time: speedrunInput.time,
            submitDate: formattedDate,
            videoLink: speedrunInput.videoLink,
            isValidated: false,
            speedrunner: user,
            game: game,
            category: category,
        });
        return speedrunDb.addSpeedrun(newSpeedRun);
    }
};

export default { addSpeedrunSubmission, getAllSpeedruns };
