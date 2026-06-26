'use client';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { getPromotionalVideoAuthUrl, uploadPromotionalVideo, type PromotionalVideoUploadResponse } from '@/demo/service/PromotionalVideoService';

const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const formatResponseValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '-';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
};

const PromotionalVideoPage = () => {
    const toast = useRef<Toast>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState<PromotionalVideoUploadResponse | null>(null);

    useEffect(() => {
        if (!videoFile) {
            setVideoPreview('');
            return;
        }

        const previewUrl = URL.createObjectURL(videoFile);
        setVideoPreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [videoFile]);

    useEffect(() => {
        if (!thumbnailFile) {
            setThumbnailPreview('');
            return;
        }

        const previewUrl = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [thumbnailFile]);

    const clearForm = () => {
        setTitle('');
        setVideoFile(null);
        setThumbnailFile(null);
        setUploadResponse(null);

        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }

        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVideoFile(event.target.files?.[0] ?? null);
    };

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnailFile(event.target.files?.[0] ?? null);
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!videoFile) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Video file is required' });
            return;
        }

        if (!thumbnailFile) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Thumbnail file is required' });
            return;
        }

        const payload = new FormData();
        const trimmedTitle = title.trim();

        if (trimmedTitle) {
            payload.append('title', trimmedTitle);
        }

        payload.append('videoFile', videoFile);
        payload.append('thumbnailFile', thumbnailFile);

        try {
            setUploading(true);
            const response = await uploadPromotionalVideo(payload);
            setUploadResponse(response);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Promotional video uploaded' });
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to upload promotional video' });
        } finally {
            setUploading(false);
        }
    };

    const handleConnectGoogle = async () => {
        try {
            setAuthLoading(true);
            const response = await getPromotionalVideoAuthUrl();

            if (!response.authUrl) {
                throw new Error('Auth URL is missing');
            }

            window.location.href = response.authUrl;
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to open Google OAuth URL' });
        } finally {
            setAuthLoading(false);
        }
    };

    const uploadResponseEntries = uploadResponse ? Object.entries(uploadResponse) : [];

    return (
        <>
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <h5 className="m-0">Promotional Video</h5>
                            <span className="text-color-secondary">Upload promotional video and thumbnail to Google Drive</span>
                        </div>
                        <Button type="button" label="Connect Google Drive" icon="pi pi-google" outlined loading={authLoading} onClick={handleConnectGoogle} />
                    </div>

                    <form className="p-fluid formgrid grid" onSubmit={handleUpload}>
                        <div className="field col-12">
                            <label htmlFor="title">Title</label>
                            <InputText id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Optional video title" />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="videoFile">Video file</label>
                            <input ref={videoInputRef} id="videoFile" type="file" accept="video/*" className="p-inputtext p-component w-full" onChange={handleVideoChange} />
                            {videoFile ? <div className="text-600 text-sm mt-2">{`${videoFile.name} - ${formatFileSize(videoFile.size)}`}</div> : null}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="thumbnailFile">Thumbnail file</label>
                            <input ref={thumbnailInputRef} id="thumbnailFile" type="file" accept="image/*" className="p-inputtext p-component w-full" onChange={handleThumbnailChange} />
                            {thumbnailFile ? <div className="text-600 text-sm mt-2">{`${thumbnailFile.name} - ${formatFileSize(thumbnailFile.size)}`}</div> : null}
                        </div>

                        {videoPreview || thumbnailPreview ? (
                            <div className="col-12 grid">
                                {videoPreview ? (
                                    <div className="col-12 md:col-7">
                                        <div className="text-900 font-semibold mb-2">Video preview</div>
                                        <video src={videoPreview} controls playsInline preload="metadata" style={{ width: '100%', maxHeight: '22rem', borderRadius: '6px', backgroundColor: '#111827' }} />
                                    </div>
                                ) : null}
                                {thumbnailPreview ? (
                                    <div className="col-12 md:col-5">
                                        <div className="text-900 font-semibold mb-2">Thumbnail preview</div>
                                        <img src={thumbnailPreview} alt="Thumbnail preview" style={{ width: '100%', maxHeight: '22rem', objectFit: 'cover', borderRadius: '6px' }} />
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="col-12 flex flex-column gap-2 md:flex-row md:justify-content-end">
                            <Button type="button" label="Clear" icon="pi pi-times" outlined onClick={clearForm} disabled={uploading} />
                            <Button type="submit" label="Upload" icon="pi pi-upload" loading={uploading} />
                        </div>
                    </form>

                    {uploadResponseEntries.length > 0 ? (
                        <div className="border-top-1 surface-border mt-4 pt-4">
                            <div className="text-900 font-semibold mb-3">Upload response</div>
                            <div className="grid">
                                {uploadResponseEntries.map(([key, value]) => (
                                    <div key={key} className="col-12 md:col-6">
                                        <div className="text-600 text-sm mb-2">{key}</div>
                                        <pre className="m-0 white-space-pre-wrap line-height-3 surface-100 border-round p-3">{formatResponseValue(value)}</pre>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default PromotionalVideoPage;
