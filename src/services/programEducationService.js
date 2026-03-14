export async function getAllProgramEducations() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs/edu`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch program educations');
    return res.json();
}

export async function createProgramEducation(programEducationData) {
    return 0;
}