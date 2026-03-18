export async function getAllPrograms() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs`, { cache: 'no-store' }); // tránh cache nếu cần realtime
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
}

export async function getProgramById(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch program');
    return res.json();
}

export async function createProgram(programData) {
    const res = await fetch(`${API_URL}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
    });
    if (!res.ok) throw new Error('Failed to create question');
    return res.json();
}

export async function updateProgram(id, programData) {
    console.log("Updating program with data:", programData);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    });
    if (!res.ok) throw new Error('Failed to update program');
    return res.json();
}

export async function deleteQuestion(id) {
    const res = await fetch(`${API_URL}/question/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete question');
    return res.json();
}

// Program Education
export async function createProgramEducation(programEducationData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs/education`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programEducationData),
    });

    if (!res.ok) throw new Error('Failed to create program education');
    return res.json();
}

export async function updateProgramEducation(id, programEducationData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs/education/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programEducationData),
    });

    if (!res.ok) throw new Error('Failed to update program education');
    return res.json();
}

export async function deleteProgramEducation(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/programs/education/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete program education');
    return res.json();
}