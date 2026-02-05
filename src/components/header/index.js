import styles from './styles.module.scss';
import Link from 'next/link';

export default function Index(params) {
    return (
        <>
            <header className={styles.header} component='header'>
                <div className={styles.logo}>
                    <img src='./images/logo.svg'/>
                </div>
                <div className={styles.navbar}>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link href="/">Home</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/about">Features</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/contact">Community</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/blog">Blog</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/blog">Pricing</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className="navCTA" href="/blog">Register Now</Link>
                        </li>
                    </ul>
                </div>

            </header>
        </>
    );
};
