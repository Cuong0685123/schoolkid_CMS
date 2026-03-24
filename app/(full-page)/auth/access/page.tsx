'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';
import type { Page } from '@/types';

const AccessDenied: Page = () => {
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };

    return (
        <>
            <div
                className="h-screen flex flex-column bg-cover"
                style={{
                    backgroundImage: 'url(/layout/images/pages/accessDenied-bg.jpg)'
                }}
            >
                <div className="shadow-3 z-3 bg-indigo-600 p-3 flex justify-content-between flex-row align-items-center">
                    <div className="ml-3 flex" onClick={navigateToDashboard}>
                        <div>
                            <img className="h-2rem" src="/layout/images/logo/logo2x.png" alt="DASHBOARD" />
                        </div>
                    </div>
                    <div className="mr-3 flex">
                        <Button type="button" label="DASHBOARD" onClick={navigateToDashboard} text className="text-white"></Button>
                    </div>
                </div>
                <div className="align-self-center mt-auto mb-auto">
                    <div className="card text-center z-4 border-round-lg border-1 surface-border p-3 shadow-3 flex flex-column">
                        <div className="border-round-md mx-auto border-1 surface-border bg-orange-500 -mt-6 px-3 py-1">
                            <h2 className="m-0 text-0">ACCESS DENIED</h2>
                        </div>
                        <div className="surface-200 p-3 mb-5 shadow-2 border-round-md mt-3 px-6">
                            <img src="/layout/images/pages/accessDenied.png" alt="" />
                        </div>
                        <div className="text-color-secondary pb-6">Requested resource is not available.</div>
                        <Button type="button" label="GO BACK TO DASHBOARD" text onClick={navigateToDashboard}></Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccessDenied;
