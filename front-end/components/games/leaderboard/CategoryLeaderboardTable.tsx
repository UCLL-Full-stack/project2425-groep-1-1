import React, { useEffect, useState } from "react";
import { Speedrun, StatusMessage, User } from "@types";
import Link from "next/link";
import speedrunService from "@services/SpeedrunService";
import { mutate } from "swr";
import classNames from "classnames";

type Props = {
  speedruns: Speedrun[];
}

const CategoryLeaderboardTable: React.FC<Props> = ({ speedruns }: Props) => {

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) return;
    setLoggedInUser(JSON.parse(user));
  }, []);

  const formatTime = (time: number): string => {
    const date = new Date(time);

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const clearErrors = () => {
    setStatusMessages([]);
  }

  const handleValidationClick = async (id: number) => {
    clearErrors();

    if (!loggedInUser) return;
    const [res] = await Promise.all([speedrunService.validateSpeedrun({id, validatorId: loggedInUser.id!})]);
    if (res.ok) {
      mutate("categorySpeedruns");
    } else {
      const error = await res.json();
      setStatusMessages([{ message: error.message, type: "error" }]);
    }
  }

  return (
    <>
      <div className="container d-flex justify-content-center">
        { statusMessages && (
          <div className="row">
            <ul className="list-unstyled mb-3 mx-auto ">
              {statusMessages.map(({ message, type }, index) => (
                <li
                  key={index}
                  className={classNames({
                    "text-danger": type === "error",
                    "text-success": type === "success",
                  })}
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Time</th>
              <th scope="col">Username</th>
              <th scope="col">Video</th>
              <th scope="col">Status</th>
              { loggedInUser?.role == "Validator" && <th scope="col">Validate</th> }
            </tr>
          </thead>
          <tbody>
            {speedruns.map((speedrun: Speedrun, index: number) => (
              <tr key={index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{formatTime(speedrun.time)}</td>
                <td className="align-middle">{speedrun.speedrunner.username}</td>
                <td className="align-middle"><Link target="_blank" href={speedrun.videoLink}>Video</Link></td>
                <td className="align-middle">{speedrun.isValidated ? "Validated" : "Unvalidated"}</td>
                { loggedInUser?.role == "Validator" && (
                  <>
                    { !speedrun.isValidated && (
                      <td className="align-middle">
                        <button className="btn btn-outline-secondary" onClick={() => handleValidationClick(speedrun.id!)}>Validate</button>
                      </td>
                    )}
                    { speedrun.isValidated && (
                      <td className="align-middle"></td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoryLeaderboardTable;