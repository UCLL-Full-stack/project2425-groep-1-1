import { SpeedrunEvent } from "@types"


type Props = {
    speedrunEvents: SpeedrunEvent[];
}

const SpeedrunOverview: React.FC<Props> = ({ speedrunEvents }: Props) => {
    return (
        <div className="container mt-4">
          <h2 className="mb-4">Speedrun Events</h2>
          {speedrunEvents.length > 0 ? (
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Event Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Participants</th>
                </tr>
              </thead>
              <tbody>
                {speedrunEvents.map((event, index) => (
                  <tr key={event.id || index}>
                    <th scope="row">{event.id || index + 1}</th>
                    <td>{event.name}</td>
                    <td>{new Date(event.startDate).toLocaleDateString()}</td>
                    <td>{new Date(event.endDate).toLocaleDateString()}</td>
                    <td>{event.participants.length}</td>
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


export default SpeedrunOverview