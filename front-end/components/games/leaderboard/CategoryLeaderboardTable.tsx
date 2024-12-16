import React from "react";
import { Speedrun } from "@types";

type Props = {
  speedruns: Speedrun[];
}

const CategoryLeaderboardTable: React.FC<Props> = ({ speedruns }: Props) => {

  const formatTime = (time: number): string => {
    const date = new Date(time);

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  return (
    <>
      <div className="container d-flex justify-content-center">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Time</th>
              <th scope="col">Username</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {speedruns.map((speedrun: Speedrun, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatTime(speedrun.time)}</td>
                <td>{speedrun.speedrunner.username}</td>
                <td>{speedrun.isValidated ? "Validated" : "Unvalidated"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoryLeaderboardTable;