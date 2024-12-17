import { Game } from '../../model/game';
import gameDb from '../../repository/game.db';
import gameService from '../../service/game.service';

let mockGameDbGetAllGames: jest.Mock;

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
