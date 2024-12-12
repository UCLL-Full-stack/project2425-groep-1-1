import Header from '@components/header';
import Head from 'next/head';
import UserTable from "@components/users/UserTable";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Home | RunTracker</title>
        <meta name="description" content="Run tracker application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <Header/>
        <UserTable/>
      </main>
    </>
  );
};

export default Home;
