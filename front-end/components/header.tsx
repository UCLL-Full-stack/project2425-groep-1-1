import Link from 'next/link';
import SpeedrunSubmitter from './speedrun-submitter';

const Header: React.FC = () => {
    return (
        <header className='px-5 py-3 mb-2 bg-dark'>
            <nav className='nav navbar-expand-lg'>
                <Link href="/" className='nav-link px-4 fs-4 text-white'>
                    Home
                </Link>
                <Link href="/games" className='nav-link px-4 fs-4 text-white'>
                    Games
                </Link>
                <SpeedrunSubmitter/>
            </nav>
        </header>
    );
};

export default Header;
