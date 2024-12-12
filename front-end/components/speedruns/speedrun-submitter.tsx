import CategoryService from "@services/CategoryService";
import GameService from "@services/GameService";
import SpeedrunService from "@services/SpeedrunService";
import { Category, Game, SpeedrunInput } from "@types";
import { useEffect, useState } from "react";
import {useTranslation} from "next-i18next";

const SpeedrunSubmitter: React.FC = () => {

    const { t } = useTranslation();

    const [time, setTime] = useState<number>(Number.NaN);

    const [videoLink, setVideoLink] = useState<string>("");

    const [games, setGames] = useState<Array<Game>>([]);
    const [selectedGameId, setSelectedGameId] = useState<number>(Number.NaN);

    const [categories, setCategories] = useState<Array<Category>>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(Number.NaN);

    const [error, setError] = useState<string>("");

    // See NOTE below in regard to not using props.
    const getGames = async () => {
        const [response] = await Promise.all([GameService.getAllGames()]);
        const [json] = await Promise.all([response.json()]);
        setGames(json);
    }

    // See NOTE below in regard to not using props.
    const getCategories = async ({ id }: { id: number }) => {
        const [response] = await Promise.all([CategoryService.getAllCategoriesByGameId({ id })]);
        const [json] = await Promise.all([response.json()]);
        setCategories(json);
    }

    /*
     * NOTE:
     * Conscious decision to add useEffect in this component, instead of using props to pass the data,
     * since it is used in the header which would need to have code
     * in every single page to get games and check if the selectedGameId is valid.
     * This way it is modular and more reusable.
     */
    useEffect(() => {
        getGames();
    }, []);

    useEffect(() => {
        if (!isNaN(selectedGameId)) {
            getCategories({ id: selectedGameId });
        } else {
            setCategories([]);
        }
    }, [selectedGameId]);

    useEffect(() => {
        setError("");
    }, [time, videoLink, selectedGameId, selectedCategoryId])


    const onGameInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGameId(Number(event.target.value));
    }
    const onCategoryInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(Number(event.target.value));
    }

    const handleSpeedrunFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // TODO: get user id, not implemented yet (global or prop?)
        const userId: number = 1;

        const speedrunInput: SpeedrunInput = { time, videoLink, gameId: selectedGameId, categoryId: selectedCategoryId, userId };
        const [response] = await Promise.all([SpeedrunService.postSpeedrun(speedrunInput)]);
        const [json] = await Promise.all([response.json()]);
        if (response.ok) {
            window.location.reload();
        } else {
            setError((json as { status: string, message: string }).message)
        }
    }

    return (
        <>
            {/* Modal trigger button */}
            <button type="button" className='btn btn-outline-light px-4 ms-auto' data-bs-toggle="modal" data-bs-target="#SpeedrunSubmitModal">
                {t("speedrun-submitter.nav-button")}
            </button>

            {/* Modal */}
            <div className="modal fade" id="SpeedrunSubmitModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title fs-5">{t("speedrun-submitter.title")}</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSpeedrunFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="time" className="col-form-label">{t("speedrun-submitter.time")}</label>
                                    <input type="time" className="form-control" id="time" step={0.001} onChange={(event) => {
                                        const input = event.target as HTMLInputElement;
                                        setTime(input.valueAsNumber)
                                    }} required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="video-link" className="col-form-label">{t("speedrun-submitter.url")}</label>
                                    <input type="url" className="form-control" id="video-link" placeholder="https://www.example.com/..." onChange={(event) => {
                                        const input = event.target as HTMLInputElement;
                                        setVideoLink(input.value);
                                    }} required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="game" className="col-form-label">{t("speedrun-submitter.game")}</label>
                                    <select className="form-select" id="game" defaultValue="" onChange={onGameInputChange} required>
                                        <option value="" disabled>Choose a game</option>
                                        {games.map((game, index) => <option key={game.id} value={game.id}>{game.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="col-form-label">{t("speedrun-submitter.category")}</label>
                                    <select className="form-select" id="category" defaultValue="" onChange={onCategoryInputChange} disabled={!selectedGameId} required>
                                        <option value="" disabled>Choose a category</option>
                                        {categories.map((category, index) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                    </select>
                                </div>
                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {error}
                                    </div>
                                )}
                                <input type="submit" className="btn btn-primary" value={t("speedrun-submitter.button")} />
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default SpeedrunSubmitter;
