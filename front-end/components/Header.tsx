import Link from 'next/link';
import SpeedrunSubmitter from './speedruns/SpeedrunSubmitter';
import Language from "@components/language/Language";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { User } from "@types";

const Header: React.FC = () => {
    const { t } = useTranslation();

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("loggedInUser") as string);
        setLoggedInUser(user);
    }, []);

    const handleLogoutClick = () => {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
    }

    return (
        <header className='px-5 py-3 mb-2 bg-dark'>
            <nav className='nav navbar-expand-lg'>
                <Link href="/" className='nav-link px-4 fs-4 text-white'>
                    {t("header.nav.home")}
                </Link>
                <Link href="/games" className='nav-link px-4 fs-4 text-white'>
                    {t("header.nav.games")}
                </Link>
                { !loggedInUser && <Link href="/login" className='nav-link px-4 fs-4 text-white'>
                    {t("header.nav.login")}
                </Link> }
                { loggedInUser && <Link href="/login" className='nav-link px-4 fs-4 text-white' onClick={handleLogoutClick}>
                    {t("header.nav.logout")}
                </Link> }
                <Language/>
                { loggedInUser && <SpeedrunSubmitter/> }
            </nav>
        </header>
    );
};

export default Header;
