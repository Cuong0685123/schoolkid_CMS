'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { getApplications, type ApplicationRow } from '@/demo/service/ApplicationService';

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

const getStatusSeverity = (status?: string): 'success' | 'info' | 'warning' | 'danger' | 'contrast' => {
    switch (normalizeStatus(status)) {
        case 'approved':
        case 'accepted':
        case 'success':
            return 'success';
        case 'pending':
        case 'new':
            return 'warning';
        case 'reviewing':
        case 'processing':
            return 'info';
        case 'rejected':
        case 'cancelled':
        case 'canceled':
            return 'danger';
        default:
            return 'contrast';
    }
};

const ApplicationsPage = () => {
    const toast = useRef<Toast>(null);
    const [applications, setApplications] = useState<ApplicationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');

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
                    detail: 'Khong the tai danh sach application'
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

    const statusBodyTemplate = (rowData: ApplicationRow) => <Tag value={rowData.status || 'Unknown'} severity={getStatusSeverity(rowData.status)} />;

    const submittedAtBodyTemplate = (rowData: ApplicationRow) => formatSubmittedAt(rowData.submitted_at);

    const header = (
        <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between">
            <div>
                <h5 className="m-0">Applications</h5>
                <span className="text-color-secondary">Danh sach don dang ky tu phu huynh</span>
            </div>
            <span className="p-input-icon-left w-full md:w-20rem">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tim theo ten, email, so dien thoai" className="w-full" />
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
                        globalFilter={globalFilter}
                        emptyMessage="Khong co application nao"
                        header={header}
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }} />
                        <Column field="parent_name" header="Parent" sortable style={{ minWidth: '12rem' }} />
                        <Column field="parent_email" header="Email" sortable style={{ minWidth: '16rem' }} />
                        <Column field="parent_phone" header="Phone" style={{ minWidth: '12rem' }} />
                        <Column field="child_name" header="Child" sortable style={{ minWidth: '12rem' }} />
                        <Column field="child_age" header="Age" sortable style={{ minWidth: '6rem' }} />
                        <Column field="program_id" header="Program ID" sortable style={{ minWidth: '8rem' }} />
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                        <Column field="submitted_at" header="Submitted" body={submittedAtBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                        <Column field="message" header="Message" body={messageBodyTemplate} style={{ minWidth: '18rem' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default ApplicationsPage;