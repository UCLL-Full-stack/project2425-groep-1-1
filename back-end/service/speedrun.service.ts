import { SpeedrunInput } from '../types';
import speedrunDb from '../repository/speedrun.db';
import userDb from '../repository/user.db';
import gameDb from '../repository/game.db';
import categoryDb from '../repository/category.db';
import { Speedrun } from '../model/speedrun';

const addSpeedrunSubmission = (speedrunInput: SpeedrunInput) => {
    const addSpeedrunSubmission = (speedrunInput: SpeedrunInput) => {
        const user = userDb.getUserById(speedrunInput.userId);
        const game = gameDb.getGameById(speedrunInput.gameId);
        const category = categoryDb.getCategoryById(speedrunInput.categoryId);
        const todaysDate = new Date();

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
                id: 1,
                time: 3000,
                submitDate: todaysDate,
                videoLink: speedrunInput.videoLink,
                isValidated: false,
                speedrunner: user,
                game: game,
                category: category,
            });
            speedrunDb.addSpeedrun(newSpeedRun);
        }
    };
};
export default { addSpeedrunSubmission };