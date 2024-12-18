import Header from "@components/Header"
import SpeedrunOverview from "@components/speedrunEvents/SpeedrunOverview"
import Spinner from "@components/Spinner"
import SpeedrunEventService from "@services/SpeedrunEventService"
import SpeedrunService from "@services/SpeedrunService"
import { SpeedrunEvent } from "@types"
import { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import useSWR from "swr"


const SpeedrunEvents: React.FC = () => {
    const { t } = useTranslation();

    const getSpeedrunEvents = async () => {
        const [response] = await Promise.all([SpeedrunEventService.getAllSpeedrunEvents()])
    if (response.ok) {
      const [speedrunEvents]: [SpeedrunEvent[]] = await Promise.all([response.json()])
      return { speedrunEvents };
    }
  }
    
    const { data, isLoading, error } = useSWR("speedrunEvents", getSpeedrunEvents, { refreshInterval: 5000 });


    return (
        <>
          <Head>
              <title>{t('header.nav.speedrunevents')}</title>
          </Head>
          <Header/>
          <main>
            <div className={"d-flex justify-content-center flex-column mt-5"}>
              <section className="d-flex justify-content-sm-center ">
                { isLoading && <Spinner /> }
                {data && <SpeedrunOverview speedrunEvents={data.speedrunEvents}/>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </section>
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


export default SpeedrunEvents