'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { getPrograms } from '@/demo/service/ProgramService';
import styles from './page.module.scss';
import { Button } from 'primereact/button';
import clsx from 'clsx';
import Image from 'next/image';
import { ProgressSpinner } from 'primereact/progressspinner';

type ProgramEdu = {
    program_id: number;
    title: string;
    detail: string;
    thumbnail_url: string;
    age_group: string;
    duration_days: string;
    duration_hours: string;
    slug: string;
};

type ProgramSport = {
    program_id: number;
    title: string;
    detail: string;
    thumbnail_url: string;
    slug: string;
}

type ProgramTeacher = {
    program_id: number;
    full_name: string;
    profile_image_url: string;
    role: string;
    bio: string;
}

type Program = {
    id: number;
    name: string;
    type: string;
    description: string;
    ProgramEdus?: ProgramEdu[];
    ProgramSports?: ProgramSport[];
    ProgramTeachers?: ProgramTeacher[];
};

const dropdownValues = [
    { name: 'education', code: 'edu' },
    { name: 'sport', code: 'sport' },
    { name: 'teacher', code: 'teacher' }
];

const TOAST_LIFE = 4000;

const Program = () => {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>();
    const [file, setFile] = useState<any | undefined>();
    const [formData, setFormData] = useState<Program>({
        id: 0,
        name: '',
        type: '',
        description: '',
        ProgramEdus: [],
        ProgramSports: [],
        ProgramTeachers: []
    });

    const [formEducation, setFormEducation] = useState<ProgramEdu>({
        program_id: 0,
        title: '',
        detail: '',
        thumbnail_url: '',
        age_group: '',
        duration_days: '',
        duration_hours: '',
        slug: ''
    })
    const [formSport, setFormSport] = useState<ProgramSport>({
        program_id: 0,
        title: '',
        detail: '',
        thumbnail_url: '',
        slug: ''
    })

    const [formTeacher, setFormTeacher] = useState<ProgramTeacher>({
        program_id: 0,
        full_name: '',
        role: '',
        bio: '',
        profile_image_url: '',
    })

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const showToastAndRedirect = async (detail: string) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail,
            life: TOAST_LIFE
        });

        await delay(TOAST_LIFE);
        router.push('/program');
    };

    const handleEducationChange = (field: keyof ProgramEdu, value: string) => {
        console.log(field, value)
        setFormEducation(previous => ({
            ...previous,
            [field]: value
        }));
    };

    const handleSportChange = (field: keyof ProgramSport, value: string) => {
        console.log(field, value)
        setFormSport(previous => ({
            ...previous,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (formData.type === 'edu') {
            createEducationProgram(e);
            return;
        }

        if (formData.type === 'sport') {
            createSportProgram(e);
            return;
        }

        if (formData.type === 'teacher') {
            createTeacherProgram(e);
            return;
        }

        e.preventDefault();
        toast.current?.show({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select program type'
        });
    };

    const handleTeacherChange = (field: keyof ProgramTeacher, value: string) => {
        console.log(field, value)
        setFormTeacher((previous) => ({
            ...previous,
            [field]: value
        }));
    };
    

    // create new Education Program
    const createEducationProgram = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();

            // append data
            form.append('program_id', formEducation?.program_id.toString() || '');
            form.append('title', formEducation?.title || '');
            form.append('detail', formEducation?.detail || '');
            form.append('age_group', formEducation?.age_group || '');
            form.append('duration_days', formEducation?.duration_days || '');
            form.append('duration_hours', formEducation?.duration_hours || '');
            form.append('slug', formEducation?.slug || '');

            // append file nếu có
            if (file) {
                form.append('thumbnail_url', file);
            }

            const res = await fetch(`http://localhost:8080/api/programs/education`, {
                method: 'POST',
                body: form // ❗ KHÔNG set Content-Type
            });

            if (!res.ok) throw new Error('Update failed');

            await showToastAndRedirect('Tạo education thành công');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Tạo education thất bại',
                life: TOAST_LIFE
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // create new Sport Program
    const createSportProgram = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();

            // append data
            form.append('program_id', formSport?.program_id.toString() || '');
            form.append('title', formSport?.title || '');
            form.append('detail', formSport?.detail || '');
            form.append('slug', formSport?.slug || '');

            // append file nếu có
            if (file) {
                form.append('thumbnail_url', file);
            }

            const res = await fetch(`http://localhost:8080/api/programs/sport`, {
                method: 'POST',
                body: form // ❗ KHÔNG set Content-Type
            });

            if (!res.ok) throw new Error('Update failed');

            await showToastAndRedirect('Tạo sport thành công');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Tạo sport thất bại',
                life: TOAST_LIFE
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // create new Teacher Program
    const createTeacherProgram = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();

            // append data
            form.append('program_id', formTeacher?.program_id.toString() || '');
            form.append('full_name', formTeacher?.full_name || '');
            form.append('role', formTeacher?.role || '');
            form.append('bio', formTeacher?.bio || '');

            // append file nếu có
            if (file) {
                form.append('profile_image_url', file);
            }

            const res = await fetch(`http://localhost:8080/api/programs/teacher`, {
                method: 'POST',
                body: form // ❗ KHÔNG set Content-Type
            });

            if (!res.ok) throw new Error('Update failed');

            await showToastAndRedirect('Tạo teacher thành công');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Tạo teacher thất bại',
                life: TOAST_LIFE
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // fetch list Programs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/programs/');
                const json: Program[] = await res.json();
                // console.log("json:", json);
                const educationProgram = json.find((item) => item.type === 'edu');
                const sportProgram = json.find((item) => item.type === 'sport');
                const teacherProgram = json.find((item) => item.type === 'teacher');

                if (educationProgram) {
                    setFormEducation((previous) => ({
                        ...previous,
                        program_id: educationProgram.id,
                    }))
                }

                if (sportProgram) {
                    setFormSport((previous) => ({
                        ...previous,
                        program_id: sportProgram.id,
                    }))
                }

                if (teacherProgram) {
                    setFormTeacher((previous) => ({
                        ...previous,
                        program_id: teacherProgram.id,
                    }))
                }

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch program data if needed and set it to formData
    }, []);

    useEffect(() => {
        console.log("formData: ", formData);
        console.log("formEducation: ", formEducation);
        console.log("formSport: ", formSport);
        console.log("formTeacher: ", formTeacher);
    }, [formData, formEducation, formSport, formTeacher]);

    return (
        <>
            <Toast ref={toast} position="top-right" />
            <div className="col-12">
                {
                    loading && (
                        <div className="overlay">
                            <ProgressSpinner className="loader" style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
                        </div>
                    )
                }
                <div className="card p-fluid">
                    <h5>Create Program</h5>
                    <div className="field">
                        <label htmlFor="type">Type</label>
                        <Dropdown
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                type: e.value
                            }))}
                            options={dropdownValues}
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select"
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        {
                            formData.type === 'edu' && (
                                <>
                                    <div className="field">
                                        <label htmlFor="title">Title</label>
                                        <InputText id="title" type="text" value={formEducation.title} onChange={(e) => handleEducationChange("title", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="detail">Detail</label>
                                        <InputText id="detail" type="text" value={formEducation.detail} onChange={(e) => handleEducationChange("detail", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="age_group">Age Group</label>
                                        <InputText id="age_group" type="text" value={formEducation.age_group} onChange={(e) => handleEducationChange("age_group", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="duration_days">Duration Days</label>
                                        <InputText id="duration_days" type="text" value={formEducation.duration_days} onChange={(e) => handleEducationChange("duration_days", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="duration_days">slug</label>
                                        <InputText id="slug" type="text" value={formEducation.slug} onChange={(e) => handleEducationChange("slug", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="thumbnail">Thumbnail</label>
                                        <div className={styles.uploadContainer}>
                                            <div className={styles.buttonsUpload}>

                                                {/* upload image button */}
                                                <div className={styles.btnContainer}>
                                                    <input
                                                        id={`file`}
                                                        className={styles.hiddenInput}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setFile(file);
                                                            const url = URL.createObjectURL(file);
                                                            setPreview(url);
                                                        }}
                                                    />

                                                    <label htmlFor={`file`} className={styles.uploadBtn}>
                                                        Upload
                                                    </label>
                                                </div>

                                                {/* delete image upload button */}
                                                <Button type="button" label="Cancel" disabled={!preview}
                                                    onClick={() => {
                                                        setFile(undefined);
                                                        setPreview(undefined);
                                                        const input = document.getElementById('file') as HTMLInputElement;
                                                        if (input) input.value = '';
                                                    }} />
                                            </div>

                                            {
                                                preview && (
                                                    <div className={clsx(styles.imagePreview, styles.previewImageContainer)}>
                                                        <img src={preview} alt={"preview"} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {/* {sport.thumbnail_url && (
                                            <Image
                                                src={sport.thumbnail_url || '/placeholder.png'}
                                                alt="Image"
                                                width={100}
                                                height={100}
                                                className={styles.thumbnail}
                                            />
                                        )} */}
                                    </div>
                                </>
                            )
                        }
                        {
                            formData.type === 'sport' && (
                                <>
                                    <div className="field">
                                        <label htmlFor="title">Title</label>
                                        <InputText id="title" type="text" value={formSport.title} onChange={(e) => handleSportChange("title", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="detail">Detail</label>
                                        <InputText id="detail" type="text" value={formSport.detail} onChange={(e) => handleSportChange("detail", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="slug">slug</label>
                                        <InputText id="slug" type="text" value={formSport.slug} onChange={(e) => handleSportChange("slug", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="thumbnail">Thumbnail</label>
                                        <div className={styles.uploadContainer}>
                                            <div className={styles.buttonsUpload}>

                                                {/* upload image button */}
                                                <div className={styles.btnContainer}>
                                                    <input
                                                        id={`file`}
                                                        className={styles.hiddenInput}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setFile(file);
                                                            const url = URL.createObjectURL(file);
                                                            setPreview(url);
                                                        }}
                                                    />

                                                    <label htmlFor={`file`} className={styles.uploadBtn}>
                                                        Upload
                                                    </label>
                                                </div>

                                                {/* delete image upload button */}
                                                <Button type="button" label="Cancel" disabled={!preview}
                                                    onClick={() => {
                                                        setFile(undefined);
                                                        setPreview(undefined);
                                                        const input = document.getElementById('file') as HTMLInputElement;
                                                        if (input) input.value = '';
                                                    }} />
                                            </div>

                                            {
                                                preview && (
                                                    <div className={clsx(styles.imagePreview, styles.previewImageContainer)}>
                                                        <img src={preview} alt={"preview"} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {/* {sport.thumbnail_url && (
                                            <Image
                                                src={sport.thumbnail_url || '/placeholder.png'}
                                                alt="Image"
                                                width={100}
                                                height={100}
                                                className={styles.thumbnail}
                                            />
                                        )} */}
                                    </div>
                                </>
                            )
                        }
                        {
                            formData.type === 'teacher' && (
                                <>
                                    <div className="field">
                                        <label htmlFor="full_name">Full Name</label>
                                        <InputText id="full_name" type="text" value={formTeacher.full_name} onChange={(e) => handleTeacherChange("full_name", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="role">Role</label>
                                        <InputText id="role" type="text" value={formTeacher.role} onChange={(e) => handleTeacherChange("role", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bio">Bio</label>
                                        <InputText id="bio" type="text" value={formTeacher.bio} onChange={(e) => handleTeacherChange("bio", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="profile_image_url">Thumbnail</label>
                                        <div className={styles.uploadContainer}>
                                            <div className={styles.buttonsUpload}>

                                                {/* upload image button */}
                                                <div className={styles.btnContainer}>
                                                    <input
                                                        id={`file`}
                                                        className={styles.hiddenInput}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setFile(file);
                                                            const url = URL.createObjectURL(file);
                                                            setPreview(url);
                                                        }}
                                                    />

                                                    <label htmlFor={`file`} className={styles.uploadBtn}>
                                                        Upload
                                                    </label>
                                                </div>

                                                {/* delete image upload button */}
                                                <Button type="button" label="Cancel" disabled={!preview}
                                                    onClick={() => {
                                                        setFile(undefined);
                                                        setPreview(undefined);
                                                        const input = document.getElementById('file') as HTMLInputElement;
                                                        if (input) input.value = '';
                                                    }} />
                                            </div>

                                            {
                                                preview && (
                                                    <div className={clsx(styles.imagePreview, styles.previewImageContainer)}>
                                                        <img src={preview} alt={"preview"} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {/* {sport.thumbnail_url && (
                                            <Image
                                                src={sport.thumbnail_url || '/placeholder.png'}
                                                alt="Image"
                                                width={100}
                                                height={100}
                                                className={styles.thumbnail}
                                            />
                                        )} */}
                                    </div>
                                </>
                            )
                        }
                        <Button type="submit" label="Submit" className="buttonSubmit"></Button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Program;