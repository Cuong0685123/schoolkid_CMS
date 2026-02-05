'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import { loginAdmin } from '@/services/adminService';
import Loader from '@/components/loader';

export default function QuizPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // clear lỗi cũ
        setLoading(true);
        try {
            await loginAdmin(username, password);

            router.push('/dashboard');
        } catch (err) {
            setLoading(false);
            setError("Server error, please try again.");
        }
    };

    return (
        <>
            <div className={styles.loginPage}>
                {/* Loading */}
                {loading && (
                    <>
                        <div className={styles.loadingOverlay}>
                            <Loader />
                        </div>
                    </>
                )}
                <h1 className={styles.title}>Login</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input id='username' className={styles.input} type="text" value={username} onChange={(e) => handleChangeUsername(e)} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input id='password' className={styles.input} type="password" value={password} onChange={(e) => handleChangePassword(e)} />
                        {error && (<p className={styles.errorMessage}>{error}</p>)}
                    </div>


                    <div className={styles.button}>
                        <Button type="submit" mode="login">Login</Button>
                    </div>
                </form>
            </div>
        </>
    );
}