import SpeedrunEventService from "@services/SpeedrunEventService";
import { SpeedrunEvent } from "@types"
import { useTranslation } from "react-i18next";
import SpeedrunEventSubmitter from "./SpeedrunEventSubmitter";


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

  const handleDelete = (eventId: number) => {
    SpeedrunEventService.deleteSpeedrunEvent(eventId)
  }

    return (
        <div className="container mt-4">
          <h2 className="mb-4">{t('speedrunEvents.title')}</h2>
          {speedrunEvents.length > 0 ? (
            <>
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">{t('speedrunEvents.tableheaders.name')}</th>
                    <th scope="col">{t('speedrunEvents.tableheaders.startdate')}</th>
                    <th scope="col">{t('speedrunEvents.tableheaders.enddate')}</th>
                    <th scope="col">{t('speedrunEvents.tableheaders.participants')}</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {speedrunEvents.map((event, index) => (
                    <tr key={event.id || index}>
                      <td>{event.name}</td>
                      <td>{new Date(event.startDate).toLocaleDateString()}</td>
                      <td>{new Date(event.endDate).toLocaleDateString()}</td>
                      <td data-testid={"participants-" + event.id}>{event.participants.length}</td>
                      <td style={{width: "15rem"}}>
                      {parsedLoggedInUser?.role === 'Organizer' && (
                      <button
                      className="btn btn-outline-dark"
                      style={{marginRight: "0.5rem"}}
                      onClick={() => handleDelete(event.id!)}
                      >
                      {t('speedrunEvents.deleteButton')}
                      </button>
                      )} 

                      {!event.participants.some(participant => participant.id === parsedLoggedInUser?.id) && (
                          <button
                            className="btn btn-outline-dark"
                            onClick={() => handleParticipate(event.id!)}
                          >
                            {t('speedrunEvents.button')}
                          </button>
                      )}
                    </td>
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