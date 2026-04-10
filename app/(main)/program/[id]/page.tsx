'use client';
import { useParams } from 'next/navigation';

export default function ProgramDetail() {
    const params = useParams();

    return <div>Detail ID: {params.id}</div>;
}