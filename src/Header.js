import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src="/images/logo.png" alt="EduBot Logo" className={styles.logo} />
                <span className={styles.brand}>EduBot</span>
            </div>
            <nav className={styles.nav}>
                <Link to="/" className={styles.link}>Home</Link>
                <Link to="/leaderboard" className={styles.link}>Leaderboard</Link> {/* 🔁 Changed here */}
            </nav>
        </header>
    );
}

export default Header;
