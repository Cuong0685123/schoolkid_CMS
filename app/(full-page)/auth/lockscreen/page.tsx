'use client';
import React from 'react';
import { Button } from 'primereact/button';
import { Page } from '../../../../types/layout';
import { Avatar } from 'primereact/avatar';
import { Password } from 'primereact/password';

const Lockscreen: Page = () => {
    return (
        <div className="h-screen flex w-full surface-ground">
            <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center">
                <div className="w-11 sm:w-30rem">
                    <div className="flex flex-column">
                        <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-lock text-primary text-4xl"></i>
                        </div>
                        <div className="mt-4">
                            <h1 className="m-0 text-primary font-semibold text-4xl">Lock Screen</h1>
                            <span className="block text-700 mt-2">Enter your password</span>
                        </div>
                    </div>
                    <div className="flex flex-column gap-3 mt-6">
                        <div className="flex justify-content-between align-items-center">
                            <div className="flex gap-3 align-items-center">
                                <Avatar image="/demo/images/avatar/annafali.png" shape="circle" size="large">
                                    {' '}
                                </Avatar>
                                <div className="flex flex-column gap-1">
                                    <span className="text-color font-semibold text-lg">Amy Elsner</span>
                                    <span className="text-color-secondary text-sm">UX Designer</span>
                                </div>
                            </div>
                            <Button className="text-primary-500" text icon="pi pi-sign-out" label="Log out"></Button>
                        </div>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-key"></i>
                            </span>

                            <Password id="password" placeholder="Password" className="w-full"></Password>
                        </div>
                        <div className="p-inputgroup">
                            <Button className="w-full" label="UNLOCK"></Button>
                        </div>
                        <div className="p-inputgroup">
                            <Button className="w-full text-primary-500" text label="SWITCH ACCOUNT"></Button>
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

export default Lockscreen;
