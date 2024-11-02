import Header from "@components/header";
import Head from "next/head";


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
}

export default Games;