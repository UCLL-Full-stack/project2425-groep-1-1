import React from "react";
import {Game} from "@types";

type Props = {
  games: Game[];
}

const GamesOverview: React.FC<Props> = ({ games }: Props) => {

  console.log(games);

  return (
    <>
      <div className="container text-center mt-6">
        <div className="row row-cols-4">
          {games.map((game: Game) => (
            <div className="col" key={game.id}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">{game.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </>
  );
}

export default GamesOverview;