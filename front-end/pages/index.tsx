import Header from '@components/Header';
import Head from 'next/head';
import UserTable from "@components/users/UserTable";
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Home | RunTracker</title>
        <meta name="description" content="Run tracker application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
        <Header/>
      <main>
        <div className={"d-flex justify-content-center flex-column mt-5"}>
          <h3 className="text-center">Home</h3>
          <UserTable/>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Home;
