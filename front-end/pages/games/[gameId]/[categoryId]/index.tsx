import { Category, Game, Speedrun } from "@types";
import useSWR from "swr";
import speedrunService from "@services/SpeedrunService";
import Head from "next/head";
import React from "react";
import Header from "@components/Header";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CategoryLeaderboardTable from "@components/games/leaderboard/CategoryLeaderboardTable";
import { useRouter } from "next/router";
import gameService from "@services/GameService";
import categoryService from "@services/CategoryService";
import Spinner from "@components/Spinner";


const CategoryLeaderboard: React.FC = () => {

  const router = useRouter();
  const { gameId, categoryId } = router.query;


  const getSpeedrunsForCategory = async () => {
    const [gameResponse, categoryResponse, speedrunsResponse] = await Promise.all([gameService.getGameById({ id: Number(gameId as string)}), categoryService.getCategoryById({ id: Number(categoryId as string) }), speedrunService.getSpeedrunsForCategory({ categoryId: Number(categoryId as string) })]);
    if (gameResponse.ok && categoryResponse.ok && speedrunsResponse.ok) {
      const [game, category, speedruns]: [Game, Category, Speedrun[]] = await Promise.all([gameResponse.json(), categoryResponse.json(), speedrunsResponse.json()]);
      return { game, category, speedruns };
    }
  }

  const { data, isLoading, error } = useSWR("categorySpeedruns", getSpeedrunsForCategory, { refreshInterval: 5000 });


  return (
    <>
      <Head>
        <title>Leaderboard | RunTracker</title>
      </Head>
      <Header/>
      <main>
        <div className={"container d-flex justify-content-center flex-column mt-5"}>
          { isLoading && <Spinner />}
          { data && (
            <>
              <h3>{data.game.name} - {data.category.name} | Leaderboard</h3>
              <CategoryLeaderboardTable speedruns={data.speedruns}/>
            </> )}
          { error && <div className="alert alert-danger mt-3">{error}</div> }
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {locale} = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default CategoryLeaderboard;