import Header from "@components/Header";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import GamesOverview from "@components/games/GamesOverview";
import React from "react";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import gameService from "@services/GameService";
import { Game } from "@types";
import Spinner from "@components/Spinner";


const Games: React.FC = () => {
  const { t } = useTranslation();

  const getGames = async () => {
    const [response] = await Promise.all([gameService.getAllGames()])
    if (response.ok) {
      const [games]: [Game[]] = await Promise.all([response.json()])
      return { games };
    }
  }

  const { data, isLoading, error } = useSWR("games", getGames, { refreshInterval: 5000 });

  return (
    <>
      <Head>
        <title>Games | RunTracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <Header/>
      <main>
        <div className={"d-flex justify-content-center flex-column mt-5"}>
          <h3 className="text-center">{t('games.title')}</h3>
          <section className="d-flex justify-content-sm-center ">
            { isLoading && <Spinner /> }
            { data && <GamesOverview games={data.games}/> }
            { error && <div className="alert alert-danger mt-3">{error}</div> }
          </section>
        </div>
      </main>
    </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {locale} = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};


export default Games;