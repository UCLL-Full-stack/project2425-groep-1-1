import React from "react";
import {Game} from "@types";
import Link from "next/link";
import {useTranslation} from "next-i18next";

type Props = {
  games: Game[];
}

const GamesOverview: React.FC<Props> = ({ games }: Props) => {

  const { t } = useTranslation();

  return (
    <>
      <div className="container-md mt-6">
        <div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-1 g-4">
          {games.map((game: Game) => (
            <div className="col" key={game.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">{game.name}</h4>
                  <p className="card-text">{game.description}</p>
                  <Link href={"/games/" + game.id} className="btn btn-secondary stretched-link">{t("games.game.overview-button")}</Link>
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