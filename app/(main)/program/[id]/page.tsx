'use client';
import { useParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.scss';
import { Button } from 'primereact/button';

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

type Program = {
    name: string;
    type: string;
    description: string;
    ProgramEdus?: ProgramEdu[];
};

export default function ProgramDetail() {
    const params = useParams();
    const toast = useRef<Toast | null>(null);
    const [files, setFiles] = useState<any>({});
    const [previews, setPreviews] = useState<Record<number, string>>({});

    const [formData, setFormData] = useState<Program>({
        name: '',
        type: '',
        description: '',
        ProgramEdus: []
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
                    ProgramEdus: json.ProgramEdus || []
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


    useEffect(() => {
        console.log("formData: ", formData);

    }, [formData]);

    const onUpload = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
            life: 3000
        });
    };

    return (
        <>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <Toast ref={toast}></Toast>
                    <h5>Vertical</h5>
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
                        <InputText id="type" type="text" value={formData.type} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {
                formData.ProgramEdus && formData.ProgramEdus.length > 0 && formData.ProgramEdus.map((education, index) => {
                    return (
                        <div key={index} className="col-12 md:col-12">
                            <div className="card p-fluid">
                                <Toast ref={toast}></Toast>
                                <h5>{education.title}</h5>
                                <div className="field">
                                    <label htmlFor="name">Title</label>
                                    <InputText id="name" type="text" value={education.title} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="description">Detail</label>
                                    <InputText id="description" type="text" value={education.title} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="age_group">Age Group</label>
                                    <InputText id="age_group" type="text" value={education.age_group} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="duration_days">Duration Days</label>
                                    <InputText id="duration_days" type="text" value={education.duration_days} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="duration_hours">Duration Hours</label>
                                    <InputText id="duration_hours" type="text" value={education.duration_hours} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="age1">Thumbnail</label>
                                    <div className={styles.uploadContainer}>
                                        <div className={styles.buttonsUpload}>
                                            <input
                                                id={`file-${index}`}
                                                className={styles.hiddenInput}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    console.log("file: ", file);
                                                    if (!file) return;

                                                    // lưu file
                                                    setFiles((prev: any) => ({
                                                        ...prev,
                                                        [index]: file
                                                    }));

                                                    // tạo preview
                                                    const url = URL.createObjectURL(file);
                                                    console.log("url: ", url);
                                                    setPreviews((prev) => ({
                                                        ...prev,
                                                        [index]: url
                                                    }));
                                                }}
                                            />

                                            <label htmlFor={`file-${index}`} className={styles.uploadBtn}>
                                                Upload
                                            </label>
                                            <Button label="cancel" />
                                        </div>

                                        {
                                            previews[index] && (
                                                <div className={styles.imagePreview}>
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
                            </div>
                        </div>
                    )
                })
            }
        </>
    );
}