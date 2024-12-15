import CategoryService from "@services/CategoryService";
import GameService from "@services/GameService";
import SpeedrunService from "@services/SpeedrunService";
import {Category, Game, SpeedrunInput, User } from "@types";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import useSWR, { mutate } from "swr";

const SpeedrunSubmitter: React.FC = () => {

    const { t } = useTranslation();

    const [time, setTime] = useState<number>(Number.NaN);
    const [videoLink, setVideoLink] = useState<string>("");
    const [selectedGameId, setSelectedGameId] = useState<number>(Number.NaN);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(Number.NaN);

    const [formError, setFormError] = useState<string>("");

    const getGamesAndCategories = async () => {
        const [gamesResponse] = await Promise.all([GameService.getAllGames()]);
        const [games]: [Game[]] = await Promise.all([gamesResponse.json()]);

        let categories: Category[] = [];
        if (!isNaN(selectedGameId)) {
            const [categoriesResponse] = await Promise.all([CategoryService.getAllCategoriesByGameId({ id: selectedGameId })]);
            [categories] = await Promise.all([categoriesResponse.json()]);
        }

        return { games, categories };
    }

    /*
     * NOTE:
     * Conscious decision to get data in this component, instead of using props to pass the data,
     * since it is used in the header which would need to have code
     * in every single page to get games and check if the selectedGameId is valid.
     * This way it is modular and more reusable.
     */
    const { data, isLoading, error } = useSWR("gamesAndCategories", getGamesAndCategories);


    useEffect(() => {
        mutate("gamesAndCategories", getGamesAndCategories());
    }, [selectedGameId]);

    useEffect(() => {
        setFormError("");
    }, [time, videoLink, selectedGameId, selectedCategoryId])


    const onGameInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGameId(Number(event.target.value));
    }
    const onCategoryInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(Number(event.target.value));
    }

    const handleSpeedrunFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const loggedInUser: User = JSON.parse(localStorage.getItem("loggedInUser") as string);
        const userId: number = loggedInUser.id as number;

        const speedrunInput: SpeedrunInput = { time, videoLink, gameId: selectedGameId, categoryId: selectedCategoryId, userId };
        const [response] = await Promise.all([SpeedrunService.postSpeedrun(speedrunInput)]);
        const [json] = await Promise.all([response.json()]);
        if (response.ok) {
            window.location.reload();
        } else {
            setFormError((json as { status: string, message: string }).message)
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
                            { !error && (<form onSubmit={handleSpeedrunFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="time" className="col-form-label">{t("speedrun-submitter.form.time.label")}</label>
                                    <input type="time" className="form-control" id="time" step={0.001} onChange={(event) => {
                                        const input = event.target as HTMLInputElement;
                                        setTime(input.valueAsNumber)
                                    }} required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="video-link" className="col-form-label">{t("speedrun-submitter.form.url.label")}</label>
                                    <input type="url" className="form-control" id="video-link" placeholder={t("speedrun-submitter.form.url.placeholder")} onChange={(event) => {
                                        const input = event.target as HTMLInputElement;
                                        setVideoLink(input.value);
                                    }} required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="game" className="col-form-label">{t("speedrun-submitter.form.game.label")}</label>
                                    { isLoading && (
                                      <div className="spinner-border" role="status">
                                          <span className="visually-hidden">Loading...</span>
                                      </div>
                                    )}
                                    <select className="form-select" id="game" defaultValue="" onChange={onGameInputChange} required>
                                        <option value="" disabled>{t("speedrun-submitter.form.game.placeholder")}</option>
                                        {data && data.games.map((game, index) => <option key={game.id} value={game.id}>{game.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="col-form-label">{t("speedrun-submitter.form.category.label")}</label>
                                    { isLoading && (
                                      <div className="spinner-border" role="status">
                                          <span className="visually-hidden">Loading...</span>
                                      </div>
                                    )}
                                    <select className="form-select" id="category" defaultValue="" onChange={onCategoryInputChange} disabled={!selectedGameId} required>
                                        <option value="" disabled>{t("speedrun-submitter.form.category.placeholder")}</option>
                                        { data && data.categories && data.categories.map((category, index) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                    </select>
                                </div>
                                {formError && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {formError}
                                    </div>
                                )}
                                <input type="submit" className="btn btn-primary" value={t("speedrun-submitter.form.button")} />
                            </form>) }
                            { error && (
                              <div className="alert alert-danger mt-3" role="alert">{error}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SpeedrunSubmitter;
