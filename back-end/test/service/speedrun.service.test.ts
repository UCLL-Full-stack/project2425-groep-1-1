import { SpeedrunInput } from '../../types';
import speedrunService from '../../service/speedrun.service';
import speedrunDb from '../../repository/speedrun.db';
import userDb from '../../repository/user.db';
import gameDb from '../../repository/game.db';
import categoryDb from '../../repository/category.db';
import { Speedrun } from '../../model/speedrun';
import { User } from '../../model/user';
import { Game } from '../../model/game';
import { Category } from '../../model/category';

let getAllSpeedrunsMock: jest.Mock;
let addSpeedrunMock: jest.Mock;
let getUserByIdMock: jest.Mock;
let getGameByIdMock: jest.Mock;
let getCategoryByIdMock: jest.Mock;
let getSpeedrunByVideoLinkMock: jest.Mock;

beforeEach(() => {
    getAllSpeedrunsMock = jest.fn().mockResolvedValue([]);
    addSpeedrunMock = jest.fn();
    getUserByIdMock = jest.fn().mockResolvedValue(
        new User({
            id: 1,
            username: 'user1',
            email: 'user1@example.com',
            password: 'password',
            signUpDate: new Date('2022-10-10T00:00:00.000Z'),
            role: 'User',
        })
    );
    getGameByIdMock = jest.fn().mockResolvedValue(
        new Game({
            id: 1,
            name: 'Game1',
            genre: 'Action',
            description: 'Exciting game',
            releaseDate: new Date('2020-01-01T00:00:00.000Z'),
        })
    );
    getCategoryByIdMock = jest.fn().mockResolvedValue(
        new Category({
            id: 1,
            name: 'Any%',
            description: 'Fastest completion',
            game: getGameByIdMock(),
        })
    );
    getSpeedrunByVideoLinkMock = jest.fn().mockResolvedValue(null);

    speedrunDb.getAllSpeedruns = getAllSpeedrunsMock;
    speedrunDb.addSpeedrun = addSpeedrunMock;
    userDb.getUserById = getUserByIdMock;
    gameDb.getGameById = getGameByIdMock;
    categoryDb.getCategoryById = getCategoryByIdMock;
    speedrunDb.getSpeedrunByVideoLink = getSpeedrunByVideoLinkMock;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid speedruninput, when adding a speedrunsubmission, then speedrun is created', async () => {
    //given
    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 1,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    //when
    await speedrunService.addSpeedrunSubmission(speedrunInput);

    //then
    expect(addSpeedrunMock).toHaveBeenCalledWith(
        new Speedrun({
            time: speedrunInput.time,
            videoLink: speedrunInput.videoLink,
            speedrunner: await getUserByIdMock(),
            game: await getGameByIdMock(),
            category: await getCategoryByIdMock(),
            isValidated: false,
        })
    );
});

test('given speedrun already exists, when adding speedrun, then an error is thrown', async () => {
    //given
    getSpeedrunByVideoLinkMock.mockResolvedValue({});

    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 1,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    //when
    const createSpeedrun = async () => await speedrunService.addSpeedrunSubmission(speedrunInput);

    // then
    expect(createSpeedrun).rejects.toThrow("Can't submit the same speedrun twice.");
});

test('given undefined user, when adding speedrunsubmission, then error is thrown', async () => {
    //given
    getUserByIdMock.mockResolvedValue(undefined);

    const speedrunInput: SpeedrunInput = {
        userId: 999,
        gameId: 1,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    // when
    const addSpeedrun = async () => await speedrunService.addSpeedrunSubmission(speedrunInput);

    // then
    expect(addSpeedrun).rejects.toThrow('User not found.');
});

test('given undefined game, when adding speedrunsubmission, then correct error is thrown', async () => {
    //given
    getGameByIdMock.mockResolvedValue(undefined);

    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 999,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    // when
    const addSpeedrun = async () => await speedrunService.addSpeedrunSubmission(speedrunInput)

    // then
    expect(addSpeedrun).rejects.toThrow('Game not found.');
});

test('given undefined category, when adding speedrunsubmission, then correct error is thrown', async () => {
    //given
    getCategoryByIdMock.mockResolvedValue(undefined);

    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 1,
        categoryId: 999,
        time: 500,
        videoLink: 'http://example.com',
    };

    // when
    const addSpeedrun = async () => await speedrunService.addSpeedrunSubmission(speedrunInput)

    // then
    expect(addSpeedrun).rejects.toThrow('Category not found.');
});

test('given correct speedrun in speedruns, when getting all speedruns, then list of speedruns is returned', async () => {
    //given
    const speedruns = [
        new Speedrun({
            id: 1,
            time: 300,
            speedrunner: getUserByIdMock(),
            videoLink: 'http://example.com',
            isValidated: false,
            game: getGameByIdMock(),
            category: getCategoryByIdMock(),
        }),
    ];
    getAllSpeedrunsMock.mockResolvedValue(speedruns);

    //when
    const result = await speedrunService.getAllSpeedruns();

    //then
    expect(getAllSpeedrunsMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(speedruns);
});
