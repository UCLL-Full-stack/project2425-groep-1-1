import CategoryService from "@services/category-service";
import GameService from "@services/game-service";
import SpeedrunService from "@services/speedrun-service";
import { Category, Game } from "@types";
import { useEffect, useState } from "react";

const SpeedrunSubmitter: React.FC = () => {

    const [games, setGames] = useState<Array<Game>>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const [categories, setCategories] = useState<Array<Category>>([]);

    const getGames = async () => {
        const [response] = await Promise.all([GameService.getAllGames()]);
        const [json] = await Promise.all([response.json()]);
        setGames(json);
    }

    const getCategories = async (game: Game) => {
        const [response] = await Promise.all([CategoryService.getAllCategoriesForGame(game)]);
        const [json] = await Promise.all([response.json()]);
        setCategories(json);
    }

    useEffect(() => {
        // getGames();
    }, []);

    useEffect(() => {
        if (selectedGame) {
            // getCategories(selectedGame);
        } else {
            setCategories([]);
        }
    }, [selectedGame]);


    const handleSpeedrunFormSubmit = () => {
        // SpeedrunService.postSpeedrun()
    }

    return (
        <>
            {/* Modal trigger button */}
            <button type="button" className='btn btn-outline-light px-4 ms-auto' data-bs-toggle="modal" data-bs-target="#SpeedrunSubmitModal">
                Submit speedrun
            </button>

            {/* Modal */}
            <div className="modal fade" id="SpeedrunSubmitModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title fs-5">Submit your speedrun</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSpeedrunFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="time" className="col-form-label">Speedrun Time:</label>
                                <input type="time" className="form-control" step={0.001} required></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="video-link" className="col-form-label">Video Link:</label>
                                <input type="url" className="form-control" id="video-link" placeholder="https://www.example.com/..."required></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="game" className="col-form-label">Game:</label>
                                <select className="form-select" id="game" required>
                                    <option selected onChange={() => setSelectedGame(null)}>Choose a game</option>
                                    {games.map((game, index) => <option key={index} value={game.id} onChange={() => setSelectedGame(game)}>{game.name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category" className="col-form-label">Category:</label>
                                <select className="form-select" id="category" disabled={!selectedGame} required>
                                    {categories.map((category, index) => <option key={index} value={category.id}>{category.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default SpeedrunSubmitter;
