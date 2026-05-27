'use client';
import { useParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import Image from 'next/image';
import styles from './page.module.scss';
import { Button } from 'primereact/button';
import clsx from 'clsx';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

type ProgramEdu = {
    id: number;
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
    id: number;
    program_id: number;
    title: string;
    detail: string;
    thumbnail_url: string;
    slug: string;
}

type ProgramTeacher = {
    id: number;
    program_id: number;
    full_name: string;
    profile_image_url: string;
    role: string;
    bio: string;
}

type Program = {
    name: string;
    type: string;
    description: string;
    ProgramEdus?: ProgramEdu[];
    ProgramSports?: ProgramSport[];
    ProgramTeachers?: ProgramTeacher[];
};

const dropdownValues = [
    { name: 'edu', code: 'edu' },
    { name: 'sport', code: 'sport' },
    { name: 'teacher', code: 'teacher' }
];

export default function ProgramDetail() {
    const params = useParams();
    const toast = useRef<Toast | null>(null);
    const [files, setFiles] = useState<any>({});
    const [previews, setPreviews] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Program>({
        name: '',
        type: '',
        description: '',
        ProgramEdus: [],
        ProgramSports: [],
        ProgramTeachers: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/programs/' + params.id);
                const json = await res.json();
                console.log("json:", json);
                setFormData({
                    name: json.name,
                    type: json.type,
                    description: json.description,
                    ProgramEdus: json.ProgramEdus || [],
                    ProgramSports: json.ProgramSports || [],
                    ProgramTeachers: json.ProgramTeachers || []
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // handle change for education
    const handleEduChange = (
        index: number,
        field: keyof ProgramEdu,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            ProgramEdus: prev.ProgramEdus?.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    // handle change for sport
    const handleSportChange = (
        index: number,
        field: keyof ProgramSport,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            ProgramSports: prev.ProgramSports?.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    // handle change for teacher
    const handleTeacherChange = (
        index: number,
        field: keyof ProgramTeacher,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            ProgramTeachers: prev.ProgramTeachers?.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };


    // useEffect(() => {
    //     console.log("formData: ", formData);
    //     console.log("type: ", formData.type);

    // }, [formData]);

    // delete image in upload
    const handleDeleteImage = (index: number) => {
        setFiles((prev: any) => ({
            ...prev,
            [index]: null
        }));

        setPreviews((prev) => ({
            ...prev,
            [index]: ""
        }));
    }

    // handle submit form
    const handleGeneralSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/programs/' + params.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log("res: ", res);

            if (res.ok) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Program updated successfully' });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update program' });
            }
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update program' });
        } finally {
            setLoading(false);
        }
    }

    // handle submit detail form
    const handleDetailEducationSubmit = async (e: any, index: number) => {
        e.preventDefault();
        setLoading(true);

        try {
            const educationId = formData.ProgramEdus?.[index].id;
            const edu = formData.ProgramEdus?.[index];
            const file = files[index];

            const form = new FormData();

            // append data
            form.append('title', edu?.title || '');
            form.append('detail', edu?.detail || '');
            form.append('age_group', edu?.age_group || '');
            form.append('duration_days', edu?.duration_days || '');
            form.append('duration_hours', edu?.duration_hours || '');

            // append file nếu có
            if (file) {
                form.append('thumbnail_url', file);
            }

            const res = await fetch(`http://localhost:8080/api/programs/education/${educationId}`, {
                method: 'PUT',
                body: form // ❗ KHÔNG set Content-Type
            });

            if (!res.ok) throw new Error('Update failed');

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Update detail thành công'
            });

        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Update detail thất bại'
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // handle submit detail form for sport
    const handleDetailSportSubmit = async (e: any, index: number) => {
        e.preventDefault();
        setLoading(true);

        try {
            const sportId = formData.ProgramSports?.[index].id;
            const sport = formData.ProgramSports?.[index];
            const file = files[index];

            const form = new FormData();
            // append data
            form.append('title', sport?.title || '');
            form.append('detail', sport?.detail || '');
            form.append('slug', sport?.slug || '');

            if (file) {
                form.append('thumbnail_url', file);
            }

            const res = await fetch(`http://localhost:8080/api/programs/sport/${sportId}`, {
                method: 'PUT',
                body: form // ❗ KHÔNG set Content-Type
            });

            if (!res.ok) throw new Error('Update failed');

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Update detail thành công'
            });

        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Update detail thất bại'
            });

            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetailTeacherSubmit = async (e: any, index: number) => {
        e.preventDefault();
        setLoading(true);

        try {
            const teacherId = formData.ProgramTeachers?.[index].id;
            const teacher = formData.ProgramTeachers?.[index];
            const file = files[index];

            const form = new FormData();
            // append data
            form.append('full_name', teacher?.full_name || '');
            form.append('role', teacher?.role || '');
            form.append('bio', teacher?.bio || '');

            if (file) {
                form.append('profile_image_url', file);
            }

            const res = await fetch(`http://localhost:8080/api/programs/teacher/${teacherId}`, {
                method: 'PUT',
                body: form // ❗ KHÔNG set Content-Type
            });

            if (!res.ok) throw new Error('Update failed');

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Update detail thành công'
            });

        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Update detail thất bại'
            });

            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="col-12 md:col-12">
                {
                    loading && (
                        <div className="overlay">
                            <ProgressSpinner className="loader" style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
                        </div>
                    )
                }
                <div className="card p-fluid">
                    <Toast ref={toast}></Toast>
                    <h5>Vertical</h5>
                    <form onSubmit={(e) => { handleGeneralSubmit(e) }}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" type="text" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" type="text" value={formData.description} onChange={handleChange} />
                        </div>
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
                        <Button type="submit" label="Submit" className={styles.buttonSubmit}></Button>
                    </form>
                </div>
            </div>

            {/* Program Education */}
            {
                formData.ProgramEdus && formData.ProgramEdus.length > 0 && formData.ProgramEdus.map((education, index) => {
                    return (
                        <div key={index} className="col-12 md:col-12">
                            <div className="card p-fluid">
                                <Toast ref={toast}></Toast>
                                <h5>{education.title}</h5>
                                <form onSubmit={(e) => { handleDetailEducationSubmit(e, index) }}>

                                    <div className="field">
                                        <label htmlFor="name">Title</label>
                                        <InputText id="name" type="text" value={education.title} onChange={(e) => handleEduChange(index, 'title', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="description">Detail</label>
                                        <InputText id="description" type="text" value={education.detail} onChange={(e) => handleEduChange(index, 'detail', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="age_group">Age Group</label>
                                        <InputText id="age_group" type="text" value={education.age_group} onChange={(e) => handleEduChange(index, 'age_group', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="duration_days">Duration Days</label>
                                        <InputText id="duration_days" type="text" value={education.duration_days} onChange={(e) => handleEduChange(index, 'duration_days', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="duration_hours">Duration Hours</label>
                                        <InputText id="duration_hours" type="text" value={education.duration_hours} onChange={(e) => handleEduChange(index, 'duration_hours', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="age1">Thumbnail</label>
                                        <div className={styles.uploadContainer}>
                                            <div className={styles.buttonsUpload}>

                                                {/* upload image button */}
                                                <div className={styles.btnContainer}>
                                                    <input
                                                        id={`file-${index}`}
                                                        className={styles.hiddenInput}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            console.log("file: ", file);
                                                            if (!file) return;

                                                            // save file to state
                                                            setFiles((prev: any) => ({
                                                                ...prev,
                                                                [index]: file
                                                            }));

                                                            // show preview image
                                                            const url = URL.createObjectURL(file);
                                                            setPreviews((prev) => ({
                                                                ...prev,
                                                                [index]: url
                                                            }));
                                                        }}
                                                    />

                                                    <label htmlFor={`file-${index}`} className={styles.uploadBtn}>
                                                        Upload
                                                    </label>
                                                </div>

                                                {/* delete image upload button */}
                                                <Button type="button" label="Cancel" disabled={!previews[index]} onClick={() => handleDeleteImage(index)}></Button>
                                            </div>

                                            {
                                                previews[index] && (
                                                    <div className={clsx(styles.imagePreview, styles.previewImageContainer)}>
                                                        <img src={previews[index]} alt={"preview"} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {education.thumbnail_url && (
                                            <Image
                                                src={education.thumbnail_url || '/placeholder.png'}
                                                alt="Image"
                                                width={100}
                                                height={100}
                                                className={styles.thumbnail}
                                            />
                                        )}
                                    </div>
                                    <Button type="submit" label="Submit" className={styles.buttonSubmit}></Button>
                                </form>
                            </div>
                        </div>
                    )
                })
            }

            {/* Program Sport */}
            {
                formData.type === "sport" && formData.ProgramSports && formData.ProgramSports.length > 0 && formData.ProgramSports.map((sport, index) => {
                    return (
                        <div key={index} className="col-12 md:col-12">
                            <div className="card p-fluid">
                                <Toast ref={toast}></Toast>
                                <h5>{sport.title}</h5>
                                <form onSubmit={(e) => { handleDetailSportSubmit(e, index) }}>

                                    <div className="field">
                                        <label htmlFor="title">Title</label>
                                        <InputText id="title" type="text" value={sport.title} onChange={(e) => { handleSportChange(index, "title", e.target.value) }} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="detail">Detail</label>
                                        <InputText id="detail" type="text" value={sport.detail} onChange={(e) => { handleSportChange(index, "detail", e.target.value) }} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="slug">Slug</label>
                                        <InputText id="slug" type="text" value={sport.slug} onChange={(e) => { handleSportChange(index, "slug", e.target.value) }} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="thumbnail">Thumbnail</label>
                                        <div className={styles.uploadContainer}>
                                            <div className={styles.buttonsUpload}>

                                                {/* upload image button */}
                                                <div className={styles.btnContainer}>
                                                    <input
                                                        id={`file-${index}`}
                                                        className={styles.hiddenInput}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            console.log("file: ", file);
                                                            if (!file) return;

                                                            // save file to state
                                                            setFiles((prev: any) => ({
                                                                ...prev,
                                                                [index]: file
                                                            }));

                                                            // show preview image
                                                            const url = URL.createObjectURL(file);
                                                            setPreviews((prev) => ({
                                                                ...prev,
                                                                [index]: url
                                                            }));
                                                        }}
                                                    />

                                                    <label htmlFor={`file-${index}`} className={styles.uploadBtn}>
                                                        Upload
                                                    </label>
                                                </div>

                                                {/* delete image upload button */}
                                                <Button type="button" label="Cancel" disabled={!previews[index]} onClick={() => handleDeleteImage(index)} />
                                            </div>

                                            {
                                                previews[index] && (
                                                    <div className={clsx(styles.imagePreview, styles.previewImageContainer)}>
                                                        <img src={previews[index]} alt={"preview"} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {sport.thumbnail_url && (
                                            <Image
                                                src={sport.thumbnail_url || '/placeholder.png'}
                                                alt="Image"
                                                width={100}
                                                height={100}
                                                className={styles.thumbnail}
                                            />
                                        )}
                                    </div>
                                    <Button type="submit" label="Submit" className={styles.buttonSubmit}></Button>
                                </form>
                            </div>
                        </div>
                    )
                })
            }

            {/* Program Teacher */}
            {
                formData.type === "teacher" && formData.ProgramTeachers && formData.ProgramTeachers.length > 0 && formData.ProgramTeachers.map((teacher, index) => {
                    return (
                        <div key={index} className="col-12 md:col-12">
                            <div className="card p-fluid">
                                <Toast ref={toast}></Toast>
                                <h5>{teacher.full_name}</h5>
                                <form onSubmit={(e) => { handleDetailTeacherSubmit(e, index) }}>

                                    <div className="field">
                                        <label htmlFor="full_name">Full Name</label>
                                        <InputText id="full_name" type="text" value={teacher.full_name} onChange={(e) => { handleTeacherChange(index, "full_name", e.target.value) }} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="role">Role</label>
                                        <InputText id="role" type="text" value={teacher.role} onChange={(e) => { handleTeacherChange(index, "role", e.target.value) }} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bio">Bio</label>
                                        <InputText id="bio" type="text" value={teacher.bio} onChange={(e) => { handleTeacherChange(index, "bio", e.target.value) }} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="profile_image">Profile Image</label>
                                        <div className={styles.uploadContainer}>
                                            <div className={styles.buttonsUpload}>

                                                {/* upload image button */}
                                                <div className={styles.btnContainer}>
                                                    <input
                                                        id={`file-${index}`}
                                                        className={styles.hiddenInput}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            console.log("file: ", file);
                                                            if (!file) return;

                                                            // save file to state
                                                            setFiles((prev: any) => ({
                                                                ...prev,
                                                                [index]: file
                                                            }));

                                                            // show preview image
                                                            const url = URL.createObjectURL(file);
                                                            setPreviews((prev) => ({
                                                                ...prev,
                                                                [index]: url
                                                            }));
                                                        }}
                                                    />

                                                    <label htmlFor={`file-${index}`} className={styles.uploadBtn}>
                                                        Upload
                                                    </label>
                                                </div>

                                                {/* delete image upload button */}
                                                <Button type="button" label="Cancel" disabled={!previews[index]} onClick={() => handleDeleteImage(index)} />
                                            </div>

                                            {
                                                previews[index] && (
                                                    <div className={clsx(styles.imagePreview, styles.previewImageContainer)}>
                                                        <img src={previews[index]} alt={"preview"} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {teacher.profile_image_url && (
                                            <Image
                                                src={teacher.profile_image_url || '/placeholder.png'}
                                                alt="Image"
                                                width={100}
                                                height={100}
                                                className={styles.thumbnail}
                                            />
                                        )}
                                    </div>
                                    <Button type="submit" label="Submit" className={styles.buttonSubmit}></Button>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </>
    );
}