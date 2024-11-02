import Header from '@components/header';
import Head from 'next/head';

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
      </main>
    </>
  );
};

export default Home;
