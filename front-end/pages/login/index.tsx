import Head from "next/head";
import Header from "@components/Header";
import UserLoginForm from "@components/users/UserLoginForm";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React from "react";
import UserTable from "@components/users/UserTable";

const Login: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('login.title')}</title>
      </Head>
      <Header />
      <main>
        <div className={"d-flex justify-content-center flex-column mt-5"} >
          <h3 className="text-center">{t('login.title')}</h3>
          <section className="d-flex flex-column justify-content-center ">
            <UserLoginForm/>
            <UserTable/>
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
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Login;