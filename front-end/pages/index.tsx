import Header from '@components/Header';
import Head from 'next/head';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

const Home: React.FC = () => {

  const { t } = useTranslation();

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
          <div className="container mt-5" style={{maxWidth: '80ch'}}>
            <div className="text-center mb-5">
              <h2>{t('home.title')}</h2>
              <p className="lead">{t('home.subtitle')}</p>
            </div>

            <section className="mb-5">
              <h3>{t('home.what.title')}</h3>
              <p>{t('home.what.p')}</p>
              <ul>
                <li><strong>{t('home.what.list.li-1.strong')} </strong>{t('home.what.list.li-1.text')}</li>
                <li><strong>{t('home.what.list.li-2.strong')} </strong>{t('home.what.list.li-2.text')}</li>
                <li><strong>{t('home.what.list.li-3.strong')} </strong>{t('home.what.list.li-3.text')}</li>
                <li><strong>{t('home.what.list.li-4.strong')} </strong>{t('home.what.list.li-4.text')}</li>
              </ul>
            </section>

            <section className="mb-5">
              <h3>{t('home.how.title')}</h3>
              <ol>
                <li>
                  <strong>{t('home.how.list.li-1.strong')}</strong> {t('home.how.list.li-1.text')}
                </li>
                <li>
                  <strong>{t('home.how.list.li-2.strong')}</strong> {t('home.how.list.li-2.text-1')} <em>{t('home.how.list.li-2.em')}</em> {t('home.how.list.li-2.text-2')}
                </li>
                <li>
                  <strong>{t('home.how.list.li-3.strong')}</strong> {t('home.how.list.li-3.text')}
                </li>
                <li>
                  <strong>{t('home.how.list.li-4.strong')}</strong> {t('home.how.list.li-4.text')}
                </li>
              </ol>
            </section>

            <section>
              <h3>{t('home.why.title')}</h3>
              <p>{t('home.why.p-1')}</p>
              <ul>
                <li><strong>{t('home.why.list.li-1.strong')} </strong>{t('home.why.list.li-1.text')}</li>
                <li><strong>{t('home.why.list.li-2.strong')} </strong>{t('home.why.list.li-2.text')}</li>
                <li><strong>{t('home.why.list.li-3.strong')} </strong>{t('home.why.list.li-3.text')}</li>
              </ul>
              <p className="mt-3">{t('home.why.p-2')}</p>
            </section>
          </div>
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

export default Home;
