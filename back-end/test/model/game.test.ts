import { Game } from '../../model/game';
import { set } from 'date-fns';

const name: string = 'Heavenly Bodies';
const description: string =
    'Heavenly Bodies is a game about cosmonauts, the body, and the absence of gravity.';
const genre: string = 'Action, Adventure, Indie, Simulation';
const releaseDate: string = '2021-12-07';

test(`given: valid values for game, when: game is created, then: game is created with those values`, () => {
    // given

    // when
    const game = new Game({
        name,
        description,
        genre,
        releaseDate,
    });
    // then
    expect(game.getName()).toEqual(name);
    expect(game.getDescription()).toEqual(description);
    expect(game.getGenre()).toEqual(genre);
    expect(game.getReleaseDate()).toEqual(releaseDate);
});

test(`given: invalid name, when: game is created, then: an error is thrown`, () => {
    // given
    const invalidName = ' ';
    // when
    const createGame = () => {
        new Game({
            name: invalidName,
            description,
            genre,
            releaseDate,
        });
    };
    // then
    expect(createGame).toThrow('Name is required.');
});

test(`given: invalid description, when: game is created, then: an error is thrown`, () => {
    // given
    const invalidDescription = ' ';
    // when
    const createGame = () => {
        new Game({
            name,
            description: invalidDescription,
            genre,
            releaseDate,
        });
    };
    // then
    expect(createGame).toThrow('Description is required.');
});

test(`given: invalid genre, when: game is created, then: an error is thrown`, () => {
    // given
    const invalidGenre = ' ';
    // when
    const createGame = () => {
        new Game({
            name,
            description,
            genre: invalidGenre,
            releaseDate,
        });
    };
    // then
    expect(createGame).toThrow('Genre is required.');
});

test(`given: invalid release date, when: game is created, then: an error is thrown`, () => {
    // given
    const invalidReleaseDate: string = null as any;
    // when
    const createGame = () => {
        new Game({
            name,
            description,
            genre,
            releaseDate: invalidReleaseDate,
        });
    };
    // then
    expect(createGame).toThrow('Release date is required.');
});
