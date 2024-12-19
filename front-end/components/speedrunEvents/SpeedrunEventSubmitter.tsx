import CategoryService from "@services/CategoryService";
import GameService from "@services/GameService";
import SpeedrunService from "@services/SpeedrunService";
import { Category, Game, SpeedrunEvent, User } from "@types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import useSWR, { mutate } from "swr";
import Spinner from "@components/Spinner";
import SpeedrunEventService from "@services/SpeedrunEventService";

const SpeedrunEventSubmitter: React.FC = () => {
    const { t } = useTranslation();

    const [name, setName] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [formError, setFormError] = useState<string>("");

    useEffect(() => {
        setFormError("");
    }, [name, startDate, endDate]);

    const handleSpeedrunEventFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const loggedInUser: User = JSON.parse(localStorage.getItem("loggedInUser") as string);
        const userId: number = loggedInUser.id as number;

        const speedrunEventInput: SpeedrunEvent = {
            name,
            startDate,
            endDate,
            participants: [], 
        };

        const [response] = await Promise.all([SpeedrunEventService.addSpeedrunEvent(speedrunEventInput)]);
        const [json] = await Promise.all([response.json()]);
        if (response.ok) {
            window.location.reload(); 
        } else {
            setFormError((json as { status: string, message: string }).message);
        }
    };

    return (
        <>
            {/* Modal trigger button */}
            <button type="button" className='btn btn-outline-dark px-4 ms-auto' data-bs-toggle="modal" data-bs-target="#SpeedrunEventSubmitModal">
                {t("speedrunEvents.addEventButton")}
            </button>

            {/* Modal */}
            <div className="modal fade" id="SpeedrunEventSubmitModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title fs-5">Commit a speedrun</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSpeedrunEventFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="col-form-label">Name: </label>
                                    <input type="text" className="form-control" id="name" onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="start-date" className="col-form-label">Startdate: </label>
                                    <input type="date" className="form-control" id="start-date" value={startDate.toISOString().split('T')[0]} onChange={(e) => setStartDate(new Date(e.target.value))} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="end-date" className="col-form-label">Enddate: </label>
                                    <input type="date" className="form-control" id="end-date" value={endDate.toISOString().split('T')[0]} onChange={(e) => setEndDate(new Date(e.target.value))} required />
                                </div>
                                {formError && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {formError}
                                    </div>
                                )}
                                <input type="submit" className="btn btn-primary" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SpeedrunEventSubmitter;
