import { set } from 'date-fns';
import { Category } from '../../model/category';
import { User } from '../../model/user';
import { Game } from '../../model/game';
import { Speedrun } from '../../model/speedrun';

const time: number = 1620000;
const submitDate: Date = set(new Date(), { date: 24, month: 10, year: 2024 });
const videoLink: string = 'https://www.example.com/lajksdf';
const speedrunner: User = new User({
    username: 'speedy-gonzales',
    email: 'speedy.gonzales@email.com',
    password: 'password123',
    role: 'User',
    signUpDate: set(new Date(), { date: 29, month: 8, year: 1953 }),
});
const isValidated: boolean = true;
const validator: User = new User({
    username: 'walter',
    email: 'walt.disney@email.com',
    password: '1234password',
    role: 'Admin',
    signUpDate: set(new Date(), { date: 5, month: 12, year: 1901 }),
});
const game: Game = new Game({
    name: 'Heavenly Bodies',
    description:
        'Heavenly Bodies is a game about cosmonauts, the body, and the absence of gravity.',
    genre: 'Action, Adventure, Indie, Simulation',
    releaseDate: set(new Date(), { date: 7, month: 12, year: 2021 }),
});
const category: Category = new Category({
    name: 'Any%',
    description: 'Complete the game with any percent of completion.',
    game: new Game({
        name: 'Heavenly Bodies',
        description:
            'Heavenly Bodies is a game about cosmonauts, the body, and the absence of gravity.',
        genre: 'Action, Adventure, Indie, Simulation',
        releaseDate: set(new Date(), { date: 7, month: 12, year: 2021 }),
    }),
});

test(`given: valid values for speedrun, when: speedrun is created, then: speedrun is created with those values`, () => {
    // given

    // when
    const speedrun = new Speedrun({
        time,
        submitDate,
        videoLink,
        speedrunner,
        isValidated,
        validator,
        game,
        category,
    });
    // then
    expect(speedrun.getTime()).toEqual(time);
    expect(speedrun.getSubmitDate()).toEqual(submitDate);
    expect(speedrun.getVideoLink()).toEqual(videoLink);
    expect(speedrun.getCategory()).toEqual(category);
    expect(speedrun.getSpeedrunner()).toEqual(speedrunner);
    expect(speedrun.getIsValidated()).toEqual(isValidated);
    expect(speedrun.getValidator()).toEqual(validator);
    expect(speedrun.getGame()).toEqual(game);
});

test(`given: valid values for speedrun, is not validated and validator is undefined, when: speedrun is created, then: speedrun is created with those values`, () => {
    // given
    const undefinedValidator: User | undefined = undefined;
    const isNotValidated: boolean = false;
    // when
    const speedrun = new Speedrun({
        time,
        submitDate,
        videoLink,
        speedrunner,
        isValidated: isNotValidated,
        validator: undefinedValidator,
        game,
        category,
    });
    // then
    expect(speedrun.getTime()).toEqual(time);
    expect(speedrun.getSubmitDate()).toEqual(submitDate);
    expect(speedrun.getVideoLink()).toEqual(videoLink);
    expect(speedrun.getCategory()).toEqual(category);
    expect(speedrun.getSpeedrunner()).toEqual(speedrunner);
    expect(speedrun.getIsValidated()).toEqual(isNotValidated);
    expect(speedrun.getValidator()).toEqual(undefinedValidator);
    expect(speedrun.getGame()).toEqual(game);
});

test(`given: invalid time, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const invalidTime = -100;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time: invalidTime,
            submitDate,
            videoLink,
            speedrunner,
            isValidated,
            validator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Speedrun time cannot be a negative number.');
});

test(`given: invalid submit date, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const invalidSubmitDate: Date = null as any;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate: invalidSubmitDate,
            videoLink,
            speedrunner,
            isValidated,
            validator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Submit date is required.');
});

test(`given: empty video link, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const invalidVideoLink = '  ';
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink: invalidVideoLink,
            speedrunner,
            isValidated,
            validator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Video link is required.');
});

test(`given: invalid video link, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const invalidVideoLink = 'notaurl';
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink: invalidVideoLink,
            speedrunner,
            isValidated,
            validator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Video link must be valid.');
});

test(`given: invalid speedrunner, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const InvalidSpeedrunner: User = null as any;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink,
            speedrunner: InvalidSpeedrunner,
            isValidated,
            validator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Speedrunner is required.');
});

test(`given: is not validated but validator is defined, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const isNotValidated: boolean = false;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink,
            speedrunner,
            isValidated: isNotValidated,
            validator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Speedruns must have a validator if it is validated.');
});

test(`given: is validated but validator is undefined, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const undefinedValidator: User | undefined = undefined;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink,
            speedrunner,
            isValidated,
            validator: undefinedValidator,
            game,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Speedruns must be validated if validator is defined.');
});

test(`given: invalid game, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const invalidGame: Game = null as any;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink,
            speedrunner,
            isValidated,
            validator,
            game: invalidGame,
            category,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Game is required.');
});

test(`given: invalid category, when: speedrun is created, then: an error is thrown`, () => {
    // given
    const invalidCategory: Category = null as any;
    // when
    const createSpeedrun = () => {
        new Speedrun({
            time,
            submitDate,
            videoLink,
            speedrunner,
            isValidated,
            validator,
            game,
            category: invalidCategory,
        });
    };
    // then
    expect(createSpeedrun).toThrow('Category is required.');
});
