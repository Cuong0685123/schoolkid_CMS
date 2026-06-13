'use client';
import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';


const getErrorMessage = (data: any) => data?.message || data?.error || 'Unable to login';

const Login: Page = () => {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigateToDashboard = () => {
        router.push('/');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing information',
                detail: 'Please enter username and password'
            });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                })
            });

            const data = await response.json();
            console.log("data: ", data)


            if (!response.ok) {
                throw new Error(getErrorMessage(data));
            }
            document.cookie = `token=loggined; path=/; max-age=86400`;
            toast.current?.show({
                severity: 'success',
                summary: 'Login successful',
                detail: 'Redirecting to dashboard...',
                life: 2000
            });
            router.push('/');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Login failed',
                detail: error instanceof Error ? error.message : 'Unable to login'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-column bg-cover" style={{ backgroundImage: 'url(/layout/images/pages/login-bg.jpg)' }}>
            <Toast ref={toast} />
            <div className="shadow-2 bg-indigo-500 z-5 p-3 flex justify-content-between flex-row align-items-center">
                <div className="ml-3 flex" onClick={navigateToDashboard}>
                    <div>
                        <img className="h-2rem" src="/layout/images/logo/logo2x.png" alt="" />
                    </div>
                </div>
                <div className="mr-3 flex">
                    <Button onClick={navigateToDashboard} text className="p-button-plain text-white">
                        DASHBOARD
                    </Button>
                </div>
            </div>

            <div className="align-self-center mt-auto mb-auto">
                <div className="text-center z-5 flex flex-column border-1 border-round-md surface-border surface-card px-3">
                    <div className="-mt-5 text-white bg-cyan-700 border-round-md mx-auto px-3 py-1 border-1 surface-border">
                        <h2 className="m-0">LOGIN</h2>
                    </div>

                    <h4>Welcome</h4>

                    <div className="text-color-secondary mb-6 px-6">Please use the form to sign-in Ultima network</div>

                    <form className="w-full flex flex-column gap-3 px-3 pb-6" onSubmit={handleSubmit}>
                        <span className="p-input-icon-left">
                            <i className="pi pi-user"></i>
                            <InputText className="w-full" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} disabled={loading} autoComplete="username" />
                        </span>

                        <span className="p-input-icon-left">
                            <i className="pi pi-key"></i>
                            <InputText type="password" className="w-full" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} autoComplete="current-password" />
                        </span>
                        <Button type="submit" className="w-full my-3 px-3" label="LOGIN" loading={loading}></Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
