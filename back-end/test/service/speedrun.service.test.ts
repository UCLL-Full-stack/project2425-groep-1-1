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
    getAllSpeedrunsMock = jest.fn().mockReturnValue([]);
    addSpeedrunMock = jest.fn();
    getUserByIdMock = jest.fn().mockReturnValue(
        new User({
            id: 1,
            username: 'user1',
            email: 'user1@example.com',
            password: 'password',
            signUpDate: '2022-10-10',
            role: 'User',
        })
    );
    getGameByIdMock = jest.fn().mockReturnValue(
        new Game({
            id: 1,
            name: 'Game1',
            genre: 'Action',
            description: 'Exciting game',
            releaseDate: '2020-01-01',
        })
    );
    getCategoryByIdMock = jest.fn().mockReturnValue(
        new Category({
            id: 1,
            name: 'Any%',
            description: 'Fastest completion',
            game: getGameByIdMock(),
        })
    );
    getSpeedrunByVideoLinkMock = jest.fn().mockReturnValue(null);

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

test('given a valid speedruninput, when adding a speedrunsubmission, then speedrun is created', () => {
    //given
    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 1,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    //when
    speedrunService.addSpeedrunSubmission(speedrunInput);

    //then
    expect(addSpeedrunMock).toHaveBeenCalledWith(
        expect.objectContaining({
            time: speedrunInput.time,
            videoLink: speedrunInput.videoLink,
            speedrunner: getUserByIdMock(),
            game: getGameByIdMock(),
            category: getCategoryByIdMock(),
        })
    );
});

test('given speedrun already exists, when adding speedrun, then an error is thrown', () => {
    //given
    getSpeedrunByVideoLinkMock.mockReturnValue({});

    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 1,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    expect(() => {
        //when
        speedrunService.addSpeedrunSubmission(speedrunInput);
        //then
    }).toThrow("Can't submit the same speedrun twice.");
});

test('given undefined user, when adding speedrunsubmission, then error is thrown', () => {
    //given
    getUserByIdMock.mockReturnValue(undefined);

    const speedrunInput: SpeedrunInput = {
        userId: 999,
        gameId: 1,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    expect(() => {
        //when
        speedrunService.addSpeedrunSubmission(speedrunInput);
        //then
    }).toThrow('User not found.');
});

test('given undefined game, when adding speedrunsubmission, then correct error is thrown', () => {
    //given
    getGameByIdMock.mockReturnValue(undefined);

    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 999,
        categoryId: 1,
        time: 500,
        videoLink: 'http://example.com',
    };

    expect(() => {
        //when
        speedrunService.addSpeedrunSubmission(speedrunInput);
        //then
    }).toThrow('Game not found.');
});

test('given undefined category, when adding speedrunsubmission, then correct error is thrown', () => {
    //given
    getCategoryByIdMock.mockReturnValue(undefined);

    const speedrunInput: SpeedrunInput = {
        userId: 1,
        gameId: 1,
        categoryId: 999,
        time: 500,
        videoLink: 'http://example.com',
    };

    expect(() => {
        //when
        speedrunService.addSpeedrunSubmission(speedrunInput);
        //then
    }).toThrow('Category not found.');
});

test('given correct speedrun in speedruns, when getting all speedruns, then list of speedruns is returned', () => {
    //given
    const speedruns = [
        new Speedrun({
            id: 1,
            time: 300,
            submitDate: '2022-10-10',
            speedrunner: getUserByIdMock(),
            videoLink: 'http://example.com',
            isValidated: false,
            game: getGameByIdMock(),
            category: getCategoryByIdMock(),
        }),
    ];
    getAllSpeedrunsMock.mockReturnValue(speedruns);

    //when
    const result = speedrunService.getAllSpeedruns();

    //then
    expect(getAllSpeedrunsMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(speedruns);
});
