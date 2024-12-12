import Header from "@components/Header";
import Head from "next/head";
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";


const Games: React.FC = () => {

    return (
        <>
            <Head>
                <title>Games | RunTracker</title>    
            </Head>  
            <main>
                <Header/>
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


export default Games;