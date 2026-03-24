'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';

const ForgotPassword: Page = () => {
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };

    return (
        <div className="h-screen flex w-full surface-ground">
            <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center">
                <div className="w-11 sm:w-30rem">
                    <div className="flex flex-column">
                        <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-question text-primary text-4xl"></i>
                        </div>
                        <div className="mt-4">
                            <h1 className="m-0 text-primary font-semibold text-4xl">Forgot password?</h1>
                            <span className="block text-700 mt-2">Please enter your email address</span>
                        </div>
                    </div>
                    <div className="flex flex-column gap-3 mt-6">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-at"></i>
                            </span>
                            <InputText placeholder="Email" />
                        </div>
                        <div className="p-inputgroup">
                            <Button className="w-full" label="SUBMIT EMAIL"></Button>
                        </div>
                        <div className="p-inputgroup">
                            <Button className="w-full text-primary-500" text label="BACK TO LOGIN"></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    backgroundImage: 'url(/layout/images/pages/accessDenied-bg.jpg)'
                }}
                className="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover"
            >
                <img src="/layout/images/logo/vector_logo.png" alt="" />
            </div>
        </div>
    );
};

export default ForgotPassword;
