import { Metadata } from 'next';
import React from 'react';

interface LandingLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'PrimeReact Ultima',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
};

export default function LandingLayout({ children }: LandingLayoutProps) {
    return <React.Fragment>{children}</React.Fragment>;
}
