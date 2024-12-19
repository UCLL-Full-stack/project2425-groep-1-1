import React from 'react';
import { useTranslation } from 'next-i18next';
import { useParams } from 'next/navigation';
import gameService from '@services/GameService';
import { Category, Game } from '@types';
import useSWR from 'swr';
import Head from 'next/head';
import Header from '@components/Header';
import GamesOverview from '@components/games/GamesOverview';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CategoryOverview from '@components/categories/CategoryOverview';
import CategoryService from '@services/CategoryService';
import Spinner from "@components/Spinner";

const GameCategories: React.FC = () => {
    const { t } = useTranslation();

    const { gameId } = useParams<{ gameId: string }>();

    const getGameById = async (gameId: string) => {
        const response = await gameService.getGameById({ id: Number(gameId) });
        if (response.ok) {
            const game: Game = await response.json();
            return game;
        }
    };

    const getCategoriesByGame = async (gameId: string) => {
        const [response] = await Promise.all([
            CategoryService.getAllCategoriesByGameId({ id: Number(gameId) }),
        ]);
        if (response.ok) {
            const [categories]: [Category[]] = await Promise.all([response.json()]);
            return { categories };
        }
    };

    const {
        data: categoryData,
        isLoading: categoryIsLoading,
        error: categoryError,
    } = useSWR(`/categories/game/${gameId}`, () => getCategoriesByGame(gameId), {
        refreshInterval: 5000,
    });

    const {
        data: gameData,
        isLoading: gameDataIsLoading,
        error: gameDataError,
    } = useSWR(`/games/${gameId}`, () => getGameById(gameId), { refreshInterval: 5000 });

    return (
        <>
            <Head>
                <title>Games | RunTracker</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <Header/>
            <main>
                <div className={'d-flex justify-content-center flex-column mt-5'}>
                    { gameData && (
                        <h3 className="text-center">
                            {t('categories.title', { name: gameData.name })}
                        </h3>
                    ) }
                    <section className="d-flex justify-content-sm-center ">
                        { categoryIsLoading && <Spinner />}
                        { categoryData && gameData && (
                            <CategoryOverview
                                categories={categoryData.categories}
                                game={gameData}
                            />
                        ) }
                        { categoryError && <div className="alert alert-danger mt-3">{categoryError}</div> }
                    </section>
                </div>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default GameCategories;
