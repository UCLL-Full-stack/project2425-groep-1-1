import type { AppProps } from "next/app";
import { useEffect } from "react";
import "@styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {appWithTranslation} from "next-i18next";

function App({ Component, pageProps }: AppProps) {

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    },[]);

    return <Component {...pageProps} />;
}

export default appWithTranslation(App);
