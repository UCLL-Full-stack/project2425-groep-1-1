import SpeedrunEventService from "@services/SpeedrunEventService";
import { SpeedrunEvent } from "@types"
import { useTranslation } from "react-i18next";


type Props = {
    speedrunEvents: SpeedrunEvent[];
}

const SpeedrunEventsOverview: React.FC<Props> = ({ speedrunEvents }: Props) => {
  const { t } = useTranslation();
  const handleParticipate = (eventId: number) => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser){
      return
    }
    const parsedLoggedInUser = JSON.parse(loggedInUser);

    SpeedrunEventService.addUserToSpeedrunEvent(parsedLoggedInUser.id, eventId)
  }

    return (
        <div className="container mt-4">
          <h2 className="mb-4">{t('speedrunEvents.title')}</h2>
          {speedrunEvents.length > 0 ? (
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
                    <td>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => handleParticipate(event.id!)}
                    data-testid={"participate-button-" + event.id}
                  >
                    {t('speedrunEvents.button')}
                  </button>
                </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info">No speedrun events available.</div>
          )}
        </div>
      );
}


export default SpeedrunEventsOverview