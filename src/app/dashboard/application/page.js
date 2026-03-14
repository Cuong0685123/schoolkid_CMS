'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { getAllPrograms } from '@/services/programService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { quizList } from '@/data/fakeData.js';
import Button from '@/components/button';

export default function QuizPage() {
    const router = useRouter();
    const [programList, setProgramList] = useState([]);
    const getProgramList = async () => {
        const data = await getAllPrograms();
        console.log("data: ", data);
        setProgramList(data);
    };

    useEffect(() => {
        getProgramList();
    }, []);

    const AddNewProgram = () => {
        router.push('/dashboard/program/create');
    }

    return (
        <>
            <div className='dashboard'>
                <h1 className="title">Application Page</h1>
                <div className={styles.buttonWrapper}>
                    <Button onClick={() => AddNewProgram()} type={'button'} mode={'add'}>Add New Application</Button>
                </div>
                {programList.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.quizTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programList.map((program) => (
                                    <tr key={program.id || program.slug} className={styles.tableRow}>
                                        <td className={styles.titleCell}>
                                            {program.id}
                                        </td>
                                        <td className={styles.titleCell}>
                                            {program.name}
                                        </td>
                                        <td className={styles.descriptionCell}>
                                            {program.type}
                                        </td>
                                        <td className={styles.descriptionCell} >
                                            {program.description}
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <Link href={`/dashboard/program/${program.id}`} className={styles.editButton} title='Edit'>Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.noQuiz}>
                        <h2>No Program found</h2>
                    </div>
                )}
            </div>
        </>
    );
}