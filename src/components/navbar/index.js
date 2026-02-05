'use client';
import styles from './styles.module.scss';
import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export default function Index(params) {
    const [openIndex, setOpenIndex] = useState(null);

    const menu = [
        {
            title: 'Programs',
            links: [
                { name: 'List Programs', href: '/dashboard/program' },
            ],
        },
    ];
    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1>Dashboard</h1>
                </div>
                <div className={styles.sidebarContent} style={{ overflowY: 'scroll' }}>
                    <ul className={styles.sideList}>
                        {menu.map((item, index) => (
                            <li
                                key={index}
                                className={clsx(styles.sideItem, openIndex === index && styles.active)}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <Link href="#">
                                    <Image
                                        src="/svg/arrow-left-angle.svg"
                                        alt="arrow"
                                        width={16}
                                        height={16}
                                        className={styles.arrowIcon}
                                    />
                                    {item.title}
                                </Link>

                                <ul className={styles.subList}>
                                    {item.links.map((sub, index) => (
                                        <li key={index}>
                                            <Link href={sub.href}>{sub.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
}
