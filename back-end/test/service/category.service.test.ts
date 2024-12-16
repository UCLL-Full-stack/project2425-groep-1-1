import { Category } from '../../model/category';
import { Game } from '../../model/game';
import categoryDb from '../../repository/category.db';
import categoryService from '../../service/category.service';

let mockCategoriesDbGetAllCategoriesForGame: jest.Mock;

const game: Game = new Game({
    id: 1,
    name: 'Super Mario',
    description: 'Some game description',
    genre: 'Platformer',
    releaseDate: new Date('1985-09-13T00:00:00.000Z'),
});

const categoriesForGame: Array<Category> = [
    new Category({ id: 1, name: 'Any%', description: 'Some description', game }),
];

beforeEach(() => {
    mockCategoriesDbGetAllCategoriesForGame = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid gameId, when getting categories by gameId, then the categories for that gameId are returned', () => {
    // given
    const validGameId = game.getId()!;
    categoryDb.getAllCategoriesForGame =
        mockCategoriesDbGetAllCategoriesForGame.mockReturnValue(categoriesForGame);
    // when
    const result = categoryService.getAllCategoriesForGame({ gameId: validGameId });
    // then
    expect(mockCategoriesDbGetAllCategoriesForGame).toHaveBeenCalledTimes(1);
    expect(mockCategoriesDbGetAllCategoriesForGame).toHaveBeenCalledWith({ gameId: validGameId });
    expect(result).toEqual(categoriesForGame);
});
