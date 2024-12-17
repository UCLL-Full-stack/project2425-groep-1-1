import { Game } from '../../model/game';
import gameDb from '../../repository/game.db';
import gameService from '../../service/game.service';

let mockGameDbGetAllGames: jest.Mock;
let mockGameDbGetGameById: jest.Mock;

const games: Array<Game> = [
    new Game({
        id: 1,
        name: 'Super Mario',
        description: 'Some game description',
        genre: 'Platformer',
        releaseDate: new Date('1985-09-13T00:00:00.000Z'),
    }),
];

beforeEach(() => {
    mockGameDbGetAllGames = jest.fn();
    mockGameDbGetGameById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given ..., when getting all games, then all games are returned', () => {
    // given
    gameDb.getAllGames = mockGameDbGetAllGames.mockReturnValue(games);
    // when
    const result = gameService.getAllGames();
    // then
    expect(mockGameDbGetAllGames).toHaveBeenCalledTimes(1);
    expect(result).toEqual(games);
});

test('given existing game id, when getting game by that id, then that game is returned', () => {
    //given
    gameDb.getGameById = mockGameDbGetGameById.mockReturnValue(games[0]);
    //when
    const result = gameService.getGameById({ id: 1 });
    //then
    expect(mockGameDbGetGameById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(games[0]);
});
