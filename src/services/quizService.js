const API_URL = 'http://localhost:3001/api';

// GET ALL QUIZZES
export async function getAllQuizzes() {
    const res = await fetch(`${API_URL}/quiz`, { cache: 'no-store' }); // tránh cache nếu cần realtime
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
}

export async function createQuiz(quizData) {
    console.log("quizData: ", quizData);
    
    const res = await fetch(`${API_URL}/quiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });
    if(!res.ok) throw new Error('Failed to create quiz');
    return res.json();
}

// GET QUIZ BY ID
export async function getQuizById(id) {
    const res = await fetch(`${API_URL}/quiz/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
}

// GET QUIZ BY SLUG
export async function getQuizBySlug(slug) {
    const res = await fetch(`${API_URL}/quiz/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
}

// UPDATE QUIZ
export async function updateQuiz(id, quizData) {
    const res = await fetch(`${API_URL}/quiz/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });
    if (!res.ok) throw new Error('Failed to update quiz');
    return res.json();
}

// DELETE QUIZ
export async function deleteQuiz(id) {
    const res = await fetch(`${API_URL}/quizzes/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete quiz');
    return res.json();
}