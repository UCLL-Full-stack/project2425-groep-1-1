import React, {useEffect, useState} from 'react';
import Head from "next/head";
import Header from "@components/Header";
import useSWR from "swr";
import userService from "@services/UserService";
import {User} from "@types";
import Spinner from "@components/Spinner";
import UsersOverview from "@components/users/UsersOverview";
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Users: React.FC = () => {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getAllUsers = async () => {
    const [res] = await Promise.all([userService.getAllUsers()]);
    if (res.ok) {
      setErrorMessage(null);
      const [users]: [User[]] = await Promise.all([res.json()]);
      return { users };
    } if (res.status === 401) {
      const [error] = await Promise.all([res.json()]);
      setErrorMessage(error.message + ". Please log in");
    }
  }


  const { data, isLoading, error } = useSWR('users', getAllUsers);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <>
      <Head>
        <title>Home | RunTracker</title>
        <meta name="description" content="Run tracker application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header/>
      <main>
        <div className={"d-flex justify-content-center flex-column mt-5"}>
          { isLoading && <Spinner /> }
          { data?.users && <UsersOverview users={data.users} /> }
          { errorMessage && <div className="container d-flex justify-content-center"><div className="flex-shrink alert alert-danger mt-3">{errorMessage}</div></div> }
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


export default Users;