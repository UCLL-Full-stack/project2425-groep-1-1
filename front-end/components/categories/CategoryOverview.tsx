import { Category, Game } from '@types';
import { useTranslation } from 'react-i18next';

type Props = {
    categories: Category[];
    game: Game;
};

const CategoryOverview: React.FC<Props> = ({ categories, game }: Props) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="container mt-5 ms-8">
                <div className="row">
                    <div className="col-md-4 ">
                        <h5>{t('categories.allCategories')}</h5>
                        <div className="list-group">
                            {categories.map((category, index) => (
                                <a
                                    className="list-group-item list-group-item-action list-group-item-dark"
                                    key={index}
                                    href={'/games/' + game.id + '/' + category.id}
                                >
                                    {category.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-8">
                        <h5>{t('categories.about', { name: game.name })}</h5>
                        <div className="border p-3">
                            <p>{game.description}</p>
                            <p>Released on {new Date(game.releaseDate).toDateString()}</p>
                            <p>{game.genre}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryOverview;
