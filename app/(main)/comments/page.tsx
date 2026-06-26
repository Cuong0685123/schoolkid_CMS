'use client';

import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createComment, deleteComment, getComments, updateComment, type CommentRow } from '@/demo/service/CommentService';

type CommentFormState = {
    article_id: number | null;
    author_name: string;
    content: string;
    created_at: string;
};

const emptyForm: CommentFormState = {
    article_id: null,
    author_name: '',
    content: '',
    created_at: ''
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

const getCommentForm = (comment: CommentRow): CommentFormState => ({
    article_id: typeof comment.article_id === 'number' ? comment.article_id : Number(comment.article_id) || null,
    author_name: comment.author_name ?? '',
    content: comment.content ?? '',
    created_at: comment.created_at ? comment.created_at.slice(0, 16) : ''
});

const CommentsPage = () => {
    const toast = useRef<Toast>(null);
    const [comments, setComments] = useState<CommentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState<CommentRow | null>(null);
    const [formData, setFormData] = useState<CommentFormState>(emptyForm);

    const loadComments = useCallback(async () => {
        try {
            setLoading(true);
            setComments(await getComments());
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to load comments'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadComments();
    }, [loadComments]);

    const openCreateDialog = () => {
        setSelectedComment(null);
        setFormData(emptyForm);
        setFormVisible(true);
    };

    const openEditDialog = (comment: CommentRow) => {
        setSelectedComment(comment);
        setFormData(getCommentForm(comment));
        setFormVisible(true);
    };

    const openDeleteDialog = (comment: CommentRow) => {
        setSelectedComment(comment);
        setDeleteVisible(true);
    };

    const closeFormDialog = () => {
        setFormVisible(false);
        setSelectedComment(null);
        setFormData(emptyForm);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        }));
        setGlobalFilterValue(value);
    };

    const onArticleIdChange = (event: InputNumberValueChangeEvent) => {
        setFormData((currentForm) => ({
            ...currentForm,
            article_id: typeof event.value === 'number' ? event.value : null
        }));
    };

    const handleSubmit = async () => {
        const authorName = formData.author_name.trim();
        const content = formData.content.trim();

        if (!selectedComment && !formData.article_id) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Article ID is required' });
            return;
        }

        if (authorName.length < 2) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Author name must be at least 2 characters' });
            return;
        }

        if (content.length < 5) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Content must be at least 5 characters' });
            return;
        }

        const articleId = formData.article_id;

        try {
            setSaving(true);

            if (selectedComment) {
                await updateComment(selectedComment.id, {
                    author_name: authorName,
                    content
                });
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Comment updated' });
            } else if (articleId) {
                await createComment({
                    article_id: articleId,
                    author_name: authorName,
                    content,
                    ...(formData.created_at ? { created_at: formData.created_at } : {})
                });
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Comment created' });
            }

            closeFormDialog();
            await loadComments();
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: selectedComment ? 'Unable to update comment' : 'Unable to create comment'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedComment) {
            return;
        }

        try {
            setDeleting(true);
            await deleteComment(selectedComment.id);
            setDeleteVisible(false);
            setSelectedComment(null);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Comment deleted' });
            await loadComments();
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to delete comment' });
        } finally {
            setDeleting(false);
        }
    };

    const contentBodyTemplate = (rowData: CommentRow) => compactText(rowData.content);

    const createdAtBodyTemplate = (rowData: CommentRow) => formatDateTime(rowData.created_at);

    const actionBodyTemplate = (rowData: CommentRow) => (
        <div className="flex gap-2">
            <Button type="button" icon="pi pi-pencil" outlined rounded aria-label="Edit comment" onClick={() => openEditDialog(rowData)} />
            <Button type="button" icon="pi pi-trash" outlined rounded severity="danger" aria-label="Delete comment" onClick={() => openDeleteDialog(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between">
            <div>
                <h5 className="m-0">Comments</h5>
                <span className="text-color-secondary">Manage article comments</span>
            </div>
            <div className="flex flex-column gap-2 md:flex-row md:align-items-center">
                <span className="p-input-icon-left w-full md:w-20rem">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search comments" className="w-full" />
                </span>
                <Button type="button" label="New comment" icon="pi pi-plus" onClick={openCreateDialog} />
            </div>
        </div>
    );

    const formFooter = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" icon="pi pi-times" outlined onClick={closeFormDialog} disabled={saving} />
            <Button type="button" label={selectedComment ? 'Save' : 'Create'} icon="pi pi-check" loading={saving} onClick={handleSubmit} />
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
                        value={comments}
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
                        globalFilterFields={['id', 'article_id', 'author_name', 'content']}
                        emptyMessage="No comments found"
                        header={header}
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }} />
                        <Column field="article_id" header="Article ID" sortable style={{ minWidth: '9rem' }} />
                        <Column field="author_name" header="Author" sortable style={{ minWidth: '14rem' }} />
                        <Column field="content" header="Content" body={contentBodyTemplate} style={{ minWidth: '24rem' }} />
                        <Column field="created_at" header="Created" body={createdAtBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                        <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '9rem' }} frozen alignFrozen="right" />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={selectedComment ? `Edit comment #${selectedComment.id}` : 'Create comment'}
                visible={formVisible}
                draggable={false}
                onHide={closeFormDialog}
                footer={formFooter}
                style={{ width: 'min(92vw, 42rem)' }}
                breakpoints={{ '960px': '80vw', '640px': '96vw' }}
            >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="article_id">Article ID</label>
                        <InputNumber inputId="article_id" value={formData.article_id} onValueChange={onArticleIdChange} disabled={Boolean(selectedComment)} useGrouping={false} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="created_at">Created at</label>
                        <InputText
                            id="created_at"
                            type="datetime-local"
                            value={formData.created_at}
                            onChange={(event) => setFormData((currentForm) => ({ ...currentForm, created_at: event.target.value }))}
                            disabled={Boolean(selectedComment)}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="author_name">Author name</label>
                        <InputText id="author_name" value={formData.author_name} onChange={(event) => setFormData((currentForm) => ({ ...currentForm, author_name: event.target.value }))} />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="content">Content</label>
                        <InputTextarea id="content" value={formData.content} onChange={(event) => setFormData((currentForm) => ({ ...currentForm, content: event.target.value }))} rows={6} autoResize />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Delete comment" visible={deleteVisible} draggable={false} onHide={() => setDeleteVisible(false)} footer={deleteFooter} style={{ width: 'min(92vw, 30rem)' }}>
                <div className="flex flex-column gap-3">
                    <p className="m-0">Are you sure you want to delete this comment?</p>
                    <div className="surface-100 border-round p-3 line-height-3">{compactText(selectedComment?.content, 160)}</div>
                </div>
            </Dialog>
        </>
    );
};

export default CommentsPage;
