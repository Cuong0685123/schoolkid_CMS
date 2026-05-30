'use client';

import { FilterMatchMode } from 'primereact/api';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { getApplications, updateApplication, type ApplicationRow } from '@/demo/service/ApplicationService';

const formatSubmittedAt = (value?: string) => {
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

const normalizeStatus = (value?: string) => value?.trim().toLowerCase() || 'unknown';

const getAllowedStatus = (value?: string): 'pending' | 'approved' | 'rejected' => {
    switch (normalizeStatus(value)) {
        case 'approved':
            return 'approved';
        case 'rejected':
            return 'rejected';
        default:
            return 'pending';
    }
};

const formatStatusLabel = (value?: string) => {
    const status = getAllowedStatus(value);

    return status.charAt(0).toUpperCase() + status.slice(1);
};

const baseStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
];

const formatFieldLabel = (key: string) =>
    key
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const formatFieldValue = (key: string, value: ApplicationRow[keyof ApplicationRow]) => {
    if (value === undefined || value === null || value === '') {
        return '-';
    }

    if (key === 'submitted_at' && typeof value === 'string') {
        return formatSubmittedAt(value);
    }

    return String(value);
};

const getStatusSeverity = (status?: string): 'success' | 'info' | 'warning' | 'danger' | undefined => {
    switch (getAllowedStatus(status)) {
        case 'approved':
            return 'success';
        case 'pending':
            return 'warning';
        case 'rejected':
            return 'danger';
        default:
            return undefined;
    }
};

const ApplicationsPage = () => {
    const toast = useRef<Toast>(null);
    const [applications, setApplications] = useState<ApplicationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedApplication, setSelectedApplication] = useState<ApplicationRow | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [statusDraft, setStatusDraft] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [savingStatus, setSavingStatus] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getApplications();
                setApplications(data);
            } catch (error) {
                console.error(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to load applications'
                });
            } finally {
                setLoading(false);
            }
        };

        void fetchApplications();
    }, []);

    const messageBodyTemplate = (rowData: ApplicationRow) => {
        if (!rowData.message) {
            return '-';
        }

        const compactMessage = rowData.message.replace(/\s+/g, ' ').trim();

        if (compactMessage.length <= 60) {
            return compactMessage;
        }

        return `${compactMessage.slice(0, 60)}...`;
    };

    const statusBodyTemplate = (rowData: ApplicationRow) => <Tag value={formatStatusLabel(rowData.status)} severity={getStatusSeverity(rowData.status)} />;

    const submittedAtBodyTemplate = (rowData: ApplicationRow) => formatSubmittedAt(rowData.submitted_at);

    const actionBodyTemplate = (rowData: ApplicationRow) => (
        <Button
            type="button"
            icon="pi pi-eye"
            label="View"
            outlined
            size="small"
            onClick={() => {
                setSelectedApplication(rowData);
                setStatusDraft(getAllowedStatus(rowData.status));
                setDetailsVisible(true);
            }}
        />
    );

    const detailEntries = selectedApplication
        ? Object.entries(selectedApplication).filter(([, value]) => value !== undefined && value !== null && value !== '')
        : [];

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        }));
        setGlobalFilterValue(value);
    };

    const handleSaveStatus = async () => {
        if (!selectedApplication) {
            return;
        }

        try {
            setSavingStatus(true);

            const updatedApplication = await updateApplication(selectedApplication.id, {
                status: statusDraft
            });

            setApplications((currentApplications) =>
                currentApplications.map((application) => (application.id === selectedApplication.id ? { ...application, ...updatedApplication, status: statusDraft } : application))
            );
            setSelectedApplication((currentApplication) => (currentApplication ? { ...currentApplication, ...updatedApplication, status: statusDraft } : currentApplication));

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Application status updated'
            });
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to update application status'
            });
        } finally {
            setSavingStatus(false);
        }
    };

    const header = (
        <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between">
            <div>
                <h5 className="m-0">Applications</h5>
                <span className="text-color-secondary">Application list</span>
            </div>
            <span className="p-input-icon-left w-full md:w-20rem">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name, email, or phone" className="w-full" />
            </span>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={applications}
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
                        globalFilterFields={['parent_name', 'parent_email', 'parent_phone']}
                        emptyMessage="No applications found"
                        header={header}
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }} />
                        <Column field="parent_name" header="Parent" sortable style={{ minWidth: '12rem' }} />
                        <Column field="parent_email" header="Email" sortable style={{ minWidth: '16rem' }} />
                        <Column field="child_name" header="Child" sortable style={{ minWidth: '12rem' }} />
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                        <Column field="submitted_at" header="Submitted" body={submittedAtBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                        <Column header="Action" body={actionBodyTemplate} style={{ minWidth: '10rem' }} frozen alignFrozen="right" />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={selectedApplication ? `Application #${selectedApplication.id}` : 'Application details'}
                visible={detailsVisible}
                draggable={false}
                onHide={() => {
                    setDetailsVisible(false);
                    setSelectedApplication(null);
                }}
                style={{ width: 'min(92vw, 48rem)' }}
                breakpoints={{ '960px': '80vw', '640px': '96vw' }}
            >
                {selectedApplication ? (
                    <div className="flex flex-column gap-4">
                        <div className="grid">
                            {detailEntries.map(([key, value]) => (
                                <div key={key} className="col-12 md:col-6">
                                    <div className="text-600 text-sm mb-2">{formatFieldLabel(key)}</div>
                                    {key === 'status' ? <Tag value={formatStatusLabel(String(value))} severity={getStatusSeverity(String(value))} /> : <div className="text-900 line-height-3">{formatFieldValue(key, value)}</div>}
                                </div>
                            ))}
                        </div>

                        <div className="border-top-1 surface-border pt-4">
                            <div className="text-900 font-semibold mb-3">Update status</div>
                            <div className="flex flex-column gap-3 md:flex-row md:align-items-end">
                                <div className="flex-1">
                                    <label htmlFor="application-status" className="block text-700 mb-2">
                                        Status
                                    </label>
                                    <Dropdown
                                        inputId="application-status"
                                        value={statusDraft}
                                        options={baseStatusOptions}
                                        onChange={(e) => setStatusDraft(e.value)}
                                        placeholder="Select a status"
                                        className="w-full"
                                    />
                                </div>
                                <Button type="button" label="Save status" icon="pi pi-check" loading={savingStatus} onClick={handleSaveStatus} />
                            </div>
                        </div>
                    </div>
                ) : null}
            </Dialog>
        </>
    );
};

export default ApplicationsPage;