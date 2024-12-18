import { SpeedrunInput, SpeedrunValidationRequest } from '../../types';
import speedrunService from '../../service/speedrun.service';
import speedrunDb from '../../repository/speedrun.db';
import userDb from '../../repository/user.db';
import gameDb from '../../repository/game.db';
import categoryDb from '../../repository/category.db';
import { Speedrun } from '../../model/speedrun';
import { User } from '../../model/user';
import { Game } from '../../model/game';
import { Category } from '../../model/category';

let mockSpeedrunDbGetAllSpeedruns: jest.Mock;
let mockSpeedrunDbGetSpeedrunByVideoLink: jest.Mock;
let mockSpeedrunDbGetSpeedrunById: jest.Mock;
let mockSpeedrunDbAddSpeedrun: jest.Mock;
let mockSpeedrunDbUpdateSpeedrunValidation: jest.Mock;
let mockUserDBGetUserById: jest.Mock;
let mockGameDbGetGameById: jest.Mock;
let mockCategoryDbGetCategoryById: jest.Mock;

let user: User;
let validator: User;
let game: Game;
let category: Category;



beforeEach(() => {
    user = new User({
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        signUpDate: new Date('2022-10-10T00:00:00.000Z'),
        role: 'User',
    })
    validator = new User({
        id: 2,
        username: 'validator1',
        email: 'validator@example.com',
        password: 'password',
        signUpDate: new Date('2022-10-10T00:00:00.000Z'),
        role: 'Validator',
    });
    game = new Game({
        id: 1,
        name: 'Game1',
        genre: 'Action',
        description: 'Exciting game',
        releaseDate: new Date('2020-01-01T00:00:00.000Z'),
    });
    category = new Category({
        id: 1,
        name: 'Any%',
        description: 'Fastest completion',
        game: game,
    });

    mockSpeedrunDbGetAllSpeedruns = jest.fn();
    mockSpeedrunDbAddSpeedrun = jest.fn();
    mockSpeedrunDbGetSpeedrunById = jest.fn()
    mockSpeedrunDbGetSpeedrunByVideoLink = jest.fn();
    mockSpeedrunDbUpdateSpeedrunValidation = jest.fn();
    mockUserDBGetUserById = jest.fn();
    mockGameDbGetGameById = jest.fn();
    mockCategoryDbGetCategoryById = jest.fn();

});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid speedruninput, when adding a speedrunsubmission, then speedrun is created', async () => {
    //given
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(user);
    gameDb.getGameById = mockGameDbGetGameById.mockResolvedValue(game);
    categoryDb.getCategoryById = mockCategoryDbGetCategoryById.mockResolvedValue(category);
    speedrunDb.getSpeedrunByVideoLink = mockSpeedrunDbGetSpeedrunByVideoLink.mockResolvedValue(null);
    speedrunDb.addSpeedrun = mockSpeedrunDbAddSpeedrun.mockImplementation(async (speedrun: Speedrun)=> speedrun);
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
    expect(mockSpeedrunDbAddSpeedrun).toHaveBeenCalledWith(
        new Speedrun({
            time: speedrunInput.time,
            videoLink: speedrunInput.videoLink,
            speedrunner: await mockUserDBGetUserById(),
            game: await mockGameDbGetGameById(),
            category: await mockCategoryDbGetCategoryById(),
            isValidated: false,
        })
    );
});

test('given speedrun already exists, when adding speedrun, then an error is thrown', async () => {
    //given
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(user);
    gameDb.getGameById = mockGameDbGetGameById.mockResolvedValue(game);
    categoryDb.getCategoryById = mockCategoryDbGetCategoryById.mockResolvedValue(category);
    speedrunDb.getSpeedrunByVideoLink = mockSpeedrunDbGetSpeedrunByVideoLink.mockResolvedValue({});
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
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(undefined);
    gameDb.getGameById = mockGameDbGetGameById.mockResolvedValue(game);
    categoryDb.getCategoryById = mockCategoryDbGetCategoryById.mockResolvedValue(category);
    speedrunDb.getSpeedrunByVideoLink = mockSpeedrunDbGetSpeedrunByVideoLink.mockResolvedValue(null);
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
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(user);
    gameDb.getGameById = mockGameDbGetGameById.mockResolvedValue(undefined);
    categoryDb.getCategoryById = mockCategoryDbGetCategoryById.mockResolvedValue(category);
    speedrunDb.getSpeedrunByVideoLink = mockSpeedrunDbGetSpeedrunByVideoLink.mockResolvedValue(null);
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
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(user);
    gameDb.getGameById = mockGameDbGetGameById.mockResolvedValue(game);
    categoryDb.getCategoryById = mockCategoryDbGetCategoryById.mockResolvedValue(undefined);
    speedrunDb.getSpeedrunByVideoLink = mockSpeedrunDbGetSpeedrunByVideoLink.mockResolvedValue(null);
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
            speedrunner: user,
            videoLink: 'http://example.com',
            isValidated: false,
            game: game,
            category: category,
        }),
    ];
    speedrunDb.getAllSpeedruns = mockSpeedrunDbGetAllSpeedruns.mockResolvedValue(speedruns);

    //when
    const result = await speedrunService.getAllSpeedruns();

    //then
    expect(mockSpeedrunDbGetAllSpeedruns).toHaveBeenCalledTimes(1);
    expect(result).toEqual(speedruns);
});

test(`given: valid id and validatorId, when: validating a speedrun, then: the speedrun is validated`, async () => {
    // given
    const speedrun = new Speedrun({
        id: 1,
        time: 300,
        speedrunner: user,
        videoLink: 'http://example.com',
        isValidated: false,
        game: game,
        category: category,
    });
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(validator);
    speedrunDb.getSpeedrunById = mockSpeedrunDbGetSpeedrunById.mockResolvedValue(speedrun);
    speedrunDb.updateSpeedrunValidation = mockSpeedrunDbUpdateSpeedrunValidation.mockImplementation(async (speedrun: Speedrun) => speedrun);
    const speedrunValidationRequest: SpeedrunValidationRequest = { id: speedrun.id!, validatorId: validator.id! }

    // when
    const validatedSpeedrun = await speedrunService.validateSpeedrun(speedrunValidationRequest);

    // then
    expect(validatedSpeedrun?.getValidator()).toEqual(validator);
    expect(validatedSpeedrun?.getIsValidated()).toEqual(true);
});

test(`given: id is null, when: validating a speedrun, then: an error is thrown`, async () => {
    // given
    const speedrun = new Speedrun({
        id: 1,
        time: 300,
        speedrunner: user,
        videoLink: 'http://example.com',
        isValidated: false,
        game: game,
        category: category,
    });
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(validator);
    speedrunDb.getSpeedrunById = mockSpeedrunDbGetSpeedrunById.mockResolvedValue(speedrun);
    speedrunDb.updateSpeedrunValidation = mockSpeedrunDbUpdateSpeedrunValidation.mockImplementation(async (speedrun: Speedrun) => speedrun);
    const speedrunValidationRequest: SpeedrunValidationRequest = { id: null as any, validatorId: validator.id! }

    // when
    const validateSpeedrun = async () => await speedrunService.validateSpeedrun(speedrunValidationRequest);

    // then
    expect(validateSpeedrun).rejects.toThrow('Id is required.');
});

test(`given: validatorId is null, when: validating a speedrun, then: an error is thrown`, async () => {
    // given
    const speedrun = new Speedrun({
        id: 1,
        time: 300,
        speedrunner: user,
        videoLink: 'http://example.com',
        isValidated: false,
        game: game,
        category: category,
    });
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(validator);
    speedrunDb.getSpeedrunById = mockSpeedrunDbGetSpeedrunById.mockResolvedValue(speedrun);
    speedrunDb.updateSpeedrunValidation = mockSpeedrunDbUpdateSpeedrunValidation.mockImplementation(async (speedrun: Speedrun) => speedrun);
    const speedrunValidationRequest: SpeedrunValidationRequest = { id: speedrun.id!, validatorId: null as any }

    // when
    const validateSpeedrun = async () => await speedrunService.validateSpeedrun(speedrunValidationRequest);

    // then
    expect(validateSpeedrun).rejects.toThrow('ValidatorId is required.');
});

test(`given: speedrun doesn't exist, when: validating a speedrun, then: an error is thrown`, async () => {
    // given
    const speedrun = new Speedrun({
        id: 1,
        time: 300,
        speedrunner: user,
        videoLink: 'http://example.com',
        isValidated: false,
        game: game,
        category: category,
    });
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(validator);
    speedrunDb.getSpeedrunById = mockSpeedrunDbGetSpeedrunById.mockResolvedValue(null);
    speedrunDb.updateSpeedrunValidation = mockSpeedrunDbUpdateSpeedrunValidation.mockImplementation(async (speedrun: Speedrun) => speedrun);
    const speedrunValidationRequest: SpeedrunValidationRequest = { id: speedrun.id!, validatorId: validator.id! }

    // when
    const validateSpeedrun = async () => await speedrunService.validateSpeedrun(speedrunValidationRequest);

    // then
    expect(validateSpeedrun).rejects.toThrow('Speedrun not found.');
});

test(`given: validator doesn't exist, when: validating a speedrun, then: an error is thrown`, async () => {
    // given
    const speedrun = new Speedrun({
        id: 1,
        time: 300,
        speedrunner: user,
        videoLink: 'http://example.com',
        isValidated: false,
        game: game,
        category: category,
    });
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(null);
    speedrunDb.getSpeedrunById = mockSpeedrunDbGetSpeedrunById.mockResolvedValue(speedrun);
    speedrunDb.updateSpeedrunValidation = mockSpeedrunDbUpdateSpeedrunValidation.mockImplementation(async (speedrun: Speedrun) => speedrun);
    const speedrunValidationRequest: SpeedrunValidationRequest = { id: speedrun.id!, validatorId: validator.id! }

    // when
    const validateSpeedrun = async () => await speedrunService.validateSpeedrun(speedrunValidationRequest);

    // then
    expect(validateSpeedrun).rejects.toThrow('Validator not found.');
});

test(`given: user is not a validator, when: validating a speedrun, then: an error is thrown`, async () => {
    // given
    const speedrun = new Speedrun({
        id: 1,
        time: 300,
        speedrunner: user,
        videoLink: 'http://example.com',
        isValidated: false,
        game: game,
        category: category,
    });
    userDb.getUserById = mockUserDBGetUserById.mockResolvedValue(user);
    speedrunDb.getSpeedrunById = mockSpeedrunDbGetSpeedrunById.mockResolvedValue(speedrun);
    speedrunDb.updateSpeedrunValidation = mockSpeedrunDbUpdateSpeedrunValidation.mockImplementation(async (speedrun: Speedrun) => speedrun);
    const speedrunValidationRequest: SpeedrunValidationRequest = { id: speedrun.id!, validatorId: validator.id! }

    // when
    const validateSpeedrun = async () => await speedrunService.validateSpeedrun(speedrunValidationRequest);

    // then
    expect(validateSpeedrun).rejects.toThrow('User is not a validator.');
});
