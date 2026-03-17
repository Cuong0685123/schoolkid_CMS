'use client';
import React, { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';
import { getQuizBySlug, updateQuiz, createQuiz } from '@/services/quizService';
import { createQuestion, updateQuestion, deleteQuestion } from '@/services/programService';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';


export default function QuizDetail() {
    const router = useRouter();
    const { slug } = useParams();
    const [quizData, setQuizData] = useState({
        title: '',
        slug: '',
        description: '',
        questions: []
    });
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState();

    // useEffect(() => {
    //     if (questions) {
    //         console.log("questions:", questions);
    //     }
    //     if (quizData) {
    //         console.log("quizData:", quizData);
    //     }
    // }, [quizData, questions]);

    const handleQuestionChange = (e, qIndex, field) => {
        const newValue = e.target.value;


        setQuizData(prev => {
            const updated = { ...prev };
            updated.questions = [...prev.questions];
            updated.questions[qIndex] = {
                ...updated.questions[qIndex],
                content: {
                    ...updated.questions[qIndex].content,
                    [field]: newValue
                }
            };

            return updated;
        });
    };

    const handleQuizChange = (e, field) => {
        const newValue = e.target.value;

        setQuizData(prev => ({
            ...prev,
            [field]: newValue
        }));
    };


    const fetchQuiz = async () => {
        const data = await getQuizBySlug(slug);
        console.log("data: ", data);


        if (data && data.data) {
            setQuizData(data.data);
        }
    };

    useEffect(() => {
        if (!slug) return;

        if (slug !== "create") {
            fetchQuiz();
        }
    }, [slug]);



    const onSubmit = async (e) => {
        e.preventDefault();

        if (!quizData) return;

        if (quizData.id) {
            try {
                // 2️⃣ Update quiz trước
                const quizSubmitContent = {
                    title: quizData.title,
                    description: quizData.description
                };


                await updateQuiz(quizData.id, quizSubmitContent);

                for (const question of quizData.questions) {
                    const questionSubmitContent = {
                        quiz_id: question.quiz_id,
                        type: question.type,
                        order: question.order,
                        content: {
                            ...question.content
                        }
                    }

                    if (question.id) {
                        await updateQuestion(question.id, questionSubmitContent);
                    } else {
                        await createQuestion(questionSubmitContent);
                    }
                }
                alert("create new question successfully!");
                await fetchQuiz();


            } catch (err) {
                alert("Có lỗi khi update quiz");
            }
        } else {
            try {
                await createQuiz({
                    title: quizData.title,
                    slug: quizData.slug,
                    description: quizData.description
                });
                router.push('/quiz');
            } catch (err) {
                alert("Có lỗi khi update quiz");
            }
        }
    };

    const addNewQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: null,
                    quiz_id: prev.id,
                    type: "multiple_choice",
                    order: prev.questions.length + 1,
                    content: {
                        question: "",
                        answer1: "",
                        answer2: "",
                        answer3: "",
                        answer4: "",
                    }
                }
            ]
        }))
    };

    const onDelete = async (questionId) => {
        await deleteQuestion(questionId);
        await fetchQuiz();

    }

    return (
        <div className="dashboard">
            <h1 className="title">{quizData?.title ?? ""}</h1>

            <div className={styles.formContainer}>
                <form>
                    <div className={styles.formGroupContainer}>
                        {/* question */}
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input className={styles.input} type="text" value={quizData.title} onChange={(e) => handleQuizChange(e, "title")} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Slug</label>
                            <input className={styles.input} type="text" value={quizData.slug} onChange={(e) => handleQuizChange(e, "slug")} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>description</label>
                            <input className={styles.input} type="text" value={quizData.description} onChange={(e) => handleQuizChange(e, "description")} />
                        </div>
                    </div>

                    {quizData && quizData.questions.map((question, index) => (
                        <React.Fragment key={index}>
                            <details className={styles.dropdown}>
                                <summary>{`Question ${index}`}</summary>
                                <div className={styles.formGroupContainer}>

                                    {/* question */}
                                    <div className={styles.formGroup}>
                                        <label>Question</label>
                                        <input className={styles.input} type="text" value={quizData.questions[index].content?.question ?? ""} onChange={(e) => handleQuestionChange(e, index, "question")} />
                                    </div>

                                    {/* answer 1 */}
                                    <div className={styles.formGroup}>
                                        <label>Answer 1</label>
                                        <input className={styles.input} type="text" value={quizData.questions[index].content?.answer1 ?? ""} onChange={(e) => handleQuestionChange(e, index, "answer1")} />
                                    </div>

                                    {/* answer 2 */}
                                    <div className={styles.formGroup}>
                                        <label>Answer 2</label>
                                        <input className={styles.input} type="text" value={quizData.questions[index].content?.answer2 ?? ""} onChange={(e) => handleQuestionChange(e, index, "answer2")} />
                                    </div>

                                    {/* answer 3 */}
                                    <div className={styles.formGroup}>
                                        <label>Answer 3</label>
                                        <input className={styles.input} type="text" value={quizData.questions[index].content?.answer3 ?? ""} onChange={(e) => handleQuestionChange(e, index, "answer3")} />
                                    </div>

                                    {/* answer 4 */}
                                    <div className={styles.formGroup}>
                                        <label>Answer 4</label>
                                        <input className={styles.input} type="text" value={quizData.questions[index].content?.answer4 ?? ""} onChange={(e) => handleQuestionChange(e, index, "answer4")} />
                                    </div>

                                    {/* dropdown correct answer */}
                                    <div className={styles.formGroup}>
                                        <label>Correct Answer</label>
                                        <select>
                                            <option value="answer1">Answer 1</option>
                                            <option value="answer2">Answer 2</option>
                                            <option value="answer3">Answer 3</option>
                                            <option value="answer4">Answer 4</option>
                                        </select>
                                    </div>
                                </div>

                                {
                                    quizData.questions[index].id && (
                                        <>
                                            <div>
                                                <Button classname={styles.ctaDeleteQuestion} type={'button'} mode={'delete'} onClick={() => onDelete(quizData.questions[index].id)}>
                                                    Delete Question
                                                </Button>
                                            </div>
                                        </>
                                    )
                                }
                            </details>
                        </React.Fragment>
                    ))}

                    {
                        slug !== "create" &&
                        <div className={styles.addQuestionContainer}>
                            <Button classname={styles.ctaAddQuestion} type="button" mode={'add'} onClick={() => addNewQuestion()}>
                                + Add Question
                            </Button>
                        </div>
                    }
                </form>
            </div>

            {/* CTA */}
            <div className={styles.ctaContainer}>
                <button className={styles.ctaSave} onClick={onSubmit}>save</button>
            </div>
        </div>
    );
}