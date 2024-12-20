import SpeedrunEventService from "@services/SpeedrunEventService";
import { SpeedrunEvent } from "@types"
import { useTranslation } from "react-i18next";
import SpeedrunEventSubmitter from "./SpeedrunEventSubmitter";
import { mutate } from "swr";
import { useState } from "react";


type Props = {
    speedrunEvents: SpeedrunEvent[];
}

const SpeedrunEventsOverview: React.FC<Props> = ({ speedrunEvents }: Props) => {
  const { t } = useTranslation();
  const loggedInUser = localStorage.getItem('loggedInUser');
  const parsedLoggedInUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  const handleParticipate = (eventId: number) => {
    if (!parsedLoggedInUser) {
      return;
    }

    SpeedrunEventService.addUserToSpeedrunEvent(parsedLoggedInUser.id, eventId);
  }

  const handleDelete = async (eventId: number) => {
    await SpeedrunEventService.deleteSpeedrunEvent(eventId)

    mutate("speedrunEvents")
  }

  const checkbox = sessionStorage.getItem('showUnparticipated');

  const [showUnparticipated, setShowUnparticipated] = useState(
    () => checkbox !== null ? JSON.parse(checkbox) : false
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setShowUnparticipated(isChecked);
    sessionStorage.setItem('showUnparticipated', JSON.stringify(isChecked));
  };

  const filteredEvents = showUnparticipated
  ? speedrunEvents.filter((event) => !event.participants.some((p) => p.id === parsedLoggedInUser?.id))
  : speedrunEvents;

    return (
        <div className="container mt-4">
          <h2 className="mb-4">{t('speedrunEvents.title')}</h2>
          {parsedLoggedInUser && <div 
            className="container d-flex align-items-center"
            style={{borderWidth: "1px", borderColor: "#212529", borderStyle: "solid", borderRadius: "0.25rem", width: "fit-content", marginBottom: "0.5rem", marginLeft: "0rem"}}
          >
            <p style={{marginBottom: "0rem", marginRight: "0.5rem"}}>{t('speedrunEvents.filter')}</p>
            <input type="checkbox" checked={showUnparticipated} onChange={handleCheckboxChange} />
          </div>}
          {filteredEvents.length > 0 ? (
            <>
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">{t('speedrunEvents.tableheaders.name')}</th>
                    <th scope="col">{t('speedrunEvents.tableheaders.startdate')}</th>
                    <th scope="col">{t('speedrunEvents.tableheaders.enddate')}</th>
                    <th scope="col">{t('speedrunEvents.tableheaders.participants')}</th>
                    { parsedLoggedInUser &&<th scope="col"></th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => (
                    <tr key={event.id || index}>
                      <td>{event.name}</td>
                      <td>{new Date(event.startDate).toLocaleDateString()}</td>
                      <td>{new Date(event.endDate).toLocaleDateString()}</td>
                      <td data-testid={"participants-" + event.id}>{event.participants.length}</td>

                      {parsedLoggedInUser && <td style={{width: "15rem"}}>
                      {parsedLoggedInUser?.role === 'Organizer' && (
                      <button
                      className="btn btn-outline-dark"
                      style={{marginRight: "0.5rem"}}
                      onClick={() => handleDelete(event.id!)}
                      >
                      {t('speedrunEvents.deleteButton')}
                      </button>
                      )} 

                      { !event.participants.some(participant => participant.id === parsedLoggedInUser?.id) && (
                          <button
                            className="btn btn-outline-dark"
                            onClick={() => handleParticipate(event.id!)}
                          >
                            {t('speedrunEvents.button')}
                          </button>
                      )}
                    </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedLoggedInUser?.role === 'Organizer' && (
                <div className="mt-4">
                  <SpeedrunEventSubmitter/>
                </div>
              )}
              
            </>
          ) : (
            <div className="alert alert-info">No speedrun events available.</div>
          )}
        </div>
      );
}


export default SpeedrunEventsOverview