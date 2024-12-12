import Link from 'next/link';
import SpeedrunSubmitter from './speedruns/speedrun-submitter';
import Language from "@components/language/Language";
import {useTranslation} from "next-i18next";

const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <header className='px-5 py-3 mb-2 bg-dark'>
            <nav className='nav navbar-expand-lg'>
                <Link href="/" className='nav-link px-4 fs-4 text-white'>
                    {t("header.nav.home")}
                </Link>
                <Link href="/games" className='nav-link px-4 fs-4 text-white'>
                    {t("header.nav.games")}
                </Link>
                <Link href="/login" className='nav-link px-4 fs-4 text-white'>
                    {t("header.nav.login")}
                </Link>
                <Language/>
                <SpeedrunSubmitter/>
            </nav>
        </header>
    );
};

export default Header;
