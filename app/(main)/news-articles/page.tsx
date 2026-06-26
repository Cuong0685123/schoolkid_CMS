'use client';

import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createNewsArticle, deleteNewsArticle, getNewsArticles, updateNewsArticle, type NewsArticlePayload, type NewsArticleRow } from '@/demo/service/NewsArticleService';

type NewsArticleFormState = {
    title: string;
    slug: string;
    thumbnail_url: string;
    content: string;
    author_name: string;
    published_at: string;
};

const emptyForm: NewsArticleFormState = {
    title: '',
    slug: '',
    thumbnail_url: '',
    content: '',
    author_name: '',
    published_at: ''
};

const formatDateTime = (value?: string) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
};

const compactText = (value?: string, maxLength = 90) => {
    if (!value) {
        return '-';
    }

    const compactValue = value.replace(/\s+/g, ' ').trim();

    if (compactValue.length <= maxLength) {
        return compactValue;
    }

    return `${compactValue.slice(0, maxLength)}...`;
};

const getNewsArticleForm = (article: NewsArticleRow): NewsArticleFormState => ({
    title: article.title ?? '',
    slug: article.slug ?? '',
    thumbnail_url: article.thumbnail_url ?? '',
    content: article.content ?? '',
    author_name: article.author_name ?? '',
    published_at: article.published_at ? article.published_at.slice(0, 16) : ''
});

const buildPayload = (formData: NewsArticleFormState): NewsArticlePayload => {
    const payload: NewsArticlePayload = {};

    Object.entries(formData).forEach(([key, value]) => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
            payload[key as keyof NewsArticleFormState] = trimmedValue;
        }
    });

    return payload;
};

const NewsArticlesPage = () => {
    const toast = useRef<Toast>(null);
    const [articles, setArticles] = useState<NewsArticleRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticleRow | null>(null);
    const [formData, setFormData] = useState<NewsArticleFormState>(emptyForm);

    const loadArticles = useCallback(async () => {
        try {
            setLoading(true);
            setArticles(await getNewsArticles());
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to load news articles'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadArticles();
    }, [loadArticles]);

    const openCreateDialog = () => {
        setSelectedArticle(null);
        setFormData(emptyForm);
        setFormVisible(true);
    };

    const openEditDialog = (article: NewsArticleRow) => {
        setSelectedArticle(article);
        setFormData(getNewsArticleForm(article));
        setFormVisible(true);
    };

    const openDeleteDialog = (article: NewsArticleRow) => {
        setSelectedArticle(article);
        setDeleteVisible(true);
    };

    const closeFormDialog = () => {
        setFormVisible(false);
        setSelectedArticle(null);
        setFormData(emptyForm);
    };

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        }));
        setGlobalFilterValue(value);
    };

    const updateFormField = (field: keyof NewsArticleFormState, value: string) => {
        setFormData((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const payload = buildPayload(formData);

        if (Object.keys(payload).length === 0) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter at least one field' });
            return;
        }

        try {
            setSaving(true);

            if (selectedArticle) {
                await updateNewsArticle(selectedArticle.id, payload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'News article updated' });
            } else {
                await createNewsArticle(payload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'News article created' });
            }

            closeFormDialog();
            await loadArticles();
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: selectedArticle ? 'Unable to update news article' : 'Unable to create news article'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedArticle) {
            return;
        }

        try {
            setDeleting(true);
            await deleteNewsArticle(selectedArticle.id);
            setDeleteVisible(false);
            setSelectedArticle(null);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'News article deleted' });
            await loadArticles();
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to delete news article' });
        } finally {
            setDeleting(false);
        }
    };

    const thumbnailBodyTemplate = (rowData: NewsArticleRow) => {
        if (!rowData.thumbnail_url) {
            return '-';
        }

        return (
            <img
                src={rowData.thumbnail_url}
                alt={rowData.title ? `${rowData.title} thumbnail` : 'News article thumbnail'}
                style={{ width: '4rem', height: '3rem', objectFit: 'cover', borderRadius: '6px' }}
            />
        );
    };

    const contentBodyTemplate = (rowData: NewsArticleRow) => compactText(rowData.content);

    const publishedAtBodyTemplate = (rowData: NewsArticleRow) => formatDateTime(rowData.published_at);

    const actionBodyTemplate = (rowData: NewsArticleRow) => (
        <div className="flex gap-2">
            <Button type="button" icon="pi pi-pencil" outlined rounded aria-label="Edit news article" onClick={() => openEditDialog(rowData)} />
            <Button type="button" icon="pi pi-trash" outlined rounded severity="danger" aria-label="Delete news article" onClick={() => openDeleteDialog(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between">
            <div>
                <h5 className="m-0">News Articles</h5>
                <span className="text-color-secondary">Manage website news articles</span>
            </div>
            <div className="flex flex-column gap-2 md:flex-row md:align-items-center">
                <span className="p-input-icon-left w-full md:w-20rem">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search news articles" className="w-full" />
                </span>
                <Button type="button" label="New article" icon="pi pi-plus" onClick={openCreateDialog} />
            </div>
        </div>
    );

    const formFooter = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" icon="pi pi-times" outlined onClick={closeFormDialog} disabled={saving} />
            <Button type="button" label={selectedArticle ? 'Save' : 'Create'} icon="pi pi-check" loading={saving} onClick={handleSubmit} />
        </div>
    );

    const deleteFooter = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" icon="pi pi-times" outlined onClick={() => setDeleteVisible(false)} disabled={deleting} />
            <Button type="button" label="Delete" icon="pi pi-trash" severity="danger" loading={deleting} onClick={handleDelete} />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={articles}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        loading={loading}
                        scrollable
                        scrollHeight="500px"
                        stripedRows
                        removableSort
                        filters={filters}
                        globalFilterFields={['id', 'title', 'slug', 'author_name', 'content']}
                        emptyMessage="No news articles found"
                        header={header}
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }} />
                        <Column header="Thumbnail" body={thumbnailBodyTemplate} style={{ minWidth: '8rem' }} />
                        <Column field="title" header="Title" sortable style={{ minWidth: '16rem' }} />
                        <Column field="slug" header="Slug" sortable style={{ minWidth: '14rem' }} />
                        <Column field="author_name" header="Author" sortable style={{ minWidth: '12rem' }} />
                        <Column field="content" header="Content" body={contentBodyTemplate} style={{ minWidth: '22rem' }} />
                        <Column field="published_at" header="Published" body={publishedAtBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                        <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '9rem' }} frozen alignFrozen="right" />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={selectedArticle ? `Edit article #${selectedArticle.id}` : 'Create article'}
                visible={formVisible}
                draggable={false}
                onHide={closeFormDialog}
                footer={formFooter}
                style={{ width: 'min(92vw, 52rem)' }}
                breakpoints={{ '960px': '80vw', '640px': '96vw' }}
            >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="title">Title</label>
                        <InputText id="title" value={formData.title} onChange={(event) => updateFormField('title', event.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="slug">Slug</label>
                        <InputText id="slug" value={formData.slug} onChange={(event) => updateFormField('slug', event.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="author_name">Author name</label>
                        <InputText id="author_name" value={formData.author_name} onChange={(event) => updateFormField('author_name', event.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="published_at">Published at</label>
                        <InputText id="published_at" type="datetime-local" value={formData.published_at} onChange={(event) => updateFormField('published_at', event.target.value)} />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="thumbnail_url">Thumbnail URL</label>
                        <InputText id="thumbnail_url" value={formData.thumbnail_url} onChange={(event) => updateFormField('thumbnail_url', event.target.value)} />
                    </div>
                    {formData.thumbnail_url ? (
                        <div className="field col-12">
                            <img
                                src={formData.thumbnail_url}
                                alt="Thumbnail preview"
                                style={{ width: '10rem', height: '6rem', objectFit: 'cover', borderRadius: '6px' }}
                            />
                        </div>
                    ) : null}
                    <div className="field col-12">
                        <label htmlFor="content">Content</label>
                        <InputTextarea id="content" value={formData.content} onChange={(event) => updateFormField('content', event.target.value)} rows={8} autoResize />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Delete news article" visible={deleteVisible} draggable={false} onHide={() => setDeleteVisible(false)} footer={deleteFooter} style={{ width: 'min(92vw, 30rem)' }}>
                <div className="flex flex-column gap-3">
                    <p className="m-0">Are you sure you want to delete this news article?</p>
                    <div className="surface-100 border-round p-3 line-height-3">{selectedArticle?.title || compactText(selectedArticle?.content, 160)}</div>
                </div>
            </Dialog>
        </>
    );
};

export default NewsArticlesPage;
