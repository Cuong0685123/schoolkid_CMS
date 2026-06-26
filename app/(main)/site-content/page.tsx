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
import { createSiteContent, deleteSiteContent, getSiteContents, updateSiteContent, type CreateSiteContentPayload, type SiteContentRow, type UpdateSiteContentPayload } from '@/demo/service/SiteContentService';

type SiteContentFormState = {
    id: number | null;
    phone_number: string;
    support_email: string;
    address: string;
    admission_period: string;
    stat_years_experience: string;
    stat_students_info: string;
    stat_awards_info: string;
    footer_description: string;
    about_section_quote: string;
};

type SiteContentTextField = Exclude<keyof SiteContentFormState, 'id'>;

const textFields: SiteContentTextField[] = [
    'phone_number',
    'support_email',
    'address',
    'admission_period',
    'stat_years_experience',
    'stat_students_info',
    'stat_awards_info',
    'footer_description',
    'about_section_quote'
];

const emptyForm: SiteContentFormState = {
    id: null,
    phone_number: '',
    support_email: '',
    address: '',
    admission_period: '',
    stat_years_experience: '',
    stat_students_info: '',
    stat_awards_info: '',
    footer_description: '',
    about_section_quote: ''
};

const fieldLabels: Record<keyof SiteContentFormState, string> = {
    id: 'ID',
    phone_number: 'Phone number',
    support_email: 'Support email',
    address: 'Address',
    admission_period: 'Admission period',
    stat_years_experience: 'Years experience',
    stat_students_info: 'Students info',
    stat_awards_info: 'Awards info',
    footer_description: 'Footer description',
    about_section_quote: 'About section quote'
};

const compactText = (value?: string, maxLength = 80) => {
    if (!value) {
        return '-';
    }

    const compactValue = value.replace(/\s+/g, ' ').trim();

    if (compactValue.length <= maxLength) {
        return compactValue;
    }

    return `${compactValue.slice(0, maxLength)}...`;
};

const getSiteContentForm = (siteContent: SiteContentRow): SiteContentFormState => ({
    id: typeof siteContent.id === 'number' ? siteContent.id : Number(siteContent.id) || null,
    phone_number: siteContent.phone_number ?? '',
    support_email: siteContent.support_email ?? '',
    address: siteContent.address ?? '',
    admission_period: siteContent.admission_period ?? '',
    stat_years_experience: siteContent.stat_years_experience ?? '',
    stat_students_info: siteContent.stat_students_info ?? '',
    stat_awards_info: siteContent.stat_awards_info ?? '',
    footer_description: siteContent.footer_description ?? '',
    about_section_quote: siteContent.about_section_quote ?? ''
});

const buildUpdatePayload = (formData: SiteContentFormState): UpdateSiteContentPayload => {
    const payload: UpdateSiteContentPayload = {};

    textFields.forEach((field) => {
        const value = formData[field].trim();

        if (value) {
            payload[field] = value;
        }
    });

    return payload;
};

const SiteContentPage = () => {
    const toast = useRef<Toast>(null);
    const [siteContents, setSiteContents] = useState<SiteContentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [selectedSiteContent, setSelectedSiteContent] = useState<SiteContentRow | null>(null);
    const [formData, setFormData] = useState<SiteContentFormState>(emptyForm);

    const loadSiteContents = useCallback(async () => {
        try {
            setLoading(true);
            setSiteContents(await getSiteContents());
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to load site content'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSiteContents();
    }, [loadSiteContents]);

    const openCreateDialog = () => {
        setSelectedSiteContent(null);
        setFormData(emptyForm);
        setFormVisible(true);
    };

    const openEditDialog = (siteContent: SiteContentRow) => {
        setSelectedSiteContent(siteContent);
        setFormData(getSiteContentForm(siteContent));
        setFormVisible(true);
    };

    const openDeleteDialog = (siteContent: SiteContentRow) => {
        setSelectedSiteContent(siteContent);
        setDeleteVisible(true);
    };

    const closeFormDialog = () => {
        setFormVisible(false);
        setSelectedSiteContent(null);
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

    const onIdChange = (event: InputNumberValueChangeEvent) => {
        setFormData((currentForm) => ({
            ...currentForm,
            id: typeof event.value === 'number' ? event.value : null
        }));
    };

    const updateFormField = (field: SiteContentTextField, value: string) => {
        setFormData((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const payload = buildUpdatePayload(formData);

        if (!selectedSiteContent && !formData.id) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'ID is required' });
            return;
        }

        if (Object.keys(payload).length === 0) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter at least one content field' });
            return;
        }

        try {
            setSaving(true);

            if (selectedSiteContent) {
                await updateSiteContent(selectedSiteContent.id, payload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Site content updated' });
            } else if (formData.id) {
                const createPayload: CreateSiteContentPayload = {
                    id: formData.id,
                    ...payload
                };

                await createSiteContent(createPayload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Site content created' });
            }

            closeFormDialog();
            await loadSiteContents();
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: selectedSiteContent ? 'Unable to update site content' : 'Unable to create site content'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSiteContent) {
            return;
        }

        try {
            setDeleting(true);
            await deleteSiteContent(selectedSiteContent.id);
            setDeleteVisible(false);
            setSelectedSiteContent(null);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Site content deleted' });
            await loadSiteContents();
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to delete site content' });
        } finally {
            setDeleting(false);
        }
    };

    const footerBodyTemplate = (rowData: SiteContentRow) => compactText(rowData.footer_description);

    const quoteBodyTemplate = (rowData: SiteContentRow) => compactText(rowData.about_section_quote);

    const actionBodyTemplate = (rowData: SiteContentRow) => (
        <div className="flex gap-2">
            <Button type="button" icon="pi pi-pencil" outlined rounded aria-label="Edit site content" onClick={() => openEditDialog(rowData)} />
            <Button type="button" icon="pi pi-trash" outlined rounded severity="danger" aria-label="Delete site content" onClick={() => openDeleteDialog(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between">
            <div>
                <h5 className="m-0">Site Content</h5>
                <span className="text-color-secondary">Manage website contact, statistic, and footer content</span>
            </div>
            <div className="flex flex-column gap-2 md:flex-row md:align-items-center">
                <span className="p-input-icon-left w-full md:w-20rem">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search site content" className="w-full" />
                </span>
                <Button type="button" label="New content" icon="pi pi-plus" onClick={openCreateDialog} />
            </div>
        </div>
    );

    const formFooter = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" icon="pi pi-times" outlined onClick={closeFormDialog} disabled={saving} />
            <Button type="button" label={selectedSiteContent ? 'Save' : 'Create'} icon="pi pi-check" loading={saving} onClick={handleSubmit} />
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
                        value={siteContents}
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
                        globalFilterFields={['id', 'phone_number', 'support_email', 'address', 'admission_period', 'footer_description', 'about_section_quote']}
                        emptyMessage="No site content found"
                        header={header}
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }} />
                        <Column field="phone_number" header="Phone" sortable style={{ minWidth: '12rem' }} />
                        <Column field="support_email" header="Support email" sortable style={{ minWidth: '16rem' }} />
                        <Column field="address" header="Address" sortable style={{ minWidth: '18rem' }} />
                        <Column field="admission_period" header="Admission" sortable style={{ minWidth: '12rem' }} />
                        <Column field="footer_description" header="Footer" body={footerBodyTemplate} style={{ minWidth: '20rem' }} />
                        <Column field="about_section_quote" header="Quote" body={quoteBodyTemplate} style={{ minWidth: '20rem' }} />
                        <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '9rem' }} frozen alignFrozen="right" />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={selectedSiteContent ? `Edit site content #${selectedSiteContent.id}` : 'Create site content'}
                visible={formVisible}
                draggable={false}
                onHide={closeFormDialog}
                footer={formFooter}
                style={{ width: 'min(92vw, 56rem)' }}
                breakpoints={{ '960px': '80vw', '640px': '96vw' }}
            >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="id">{fieldLabels.id}</label>
                        <InputNumber inputId="id" value={formData.id} onValueChange={onIdChange} disabled={Boolean(selectedSiteContent)} useGrouping={false} />
                    </div>

                    <div className="col-12">
                        <div className="text-900 font-semibold mb-3">Contact</div>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="phone_number">{fieldLabels.phone_number}</label>
                        <InputText id="phone_number" value={formData.phone_number} onChange={(event) => updateFormField('phone_number', event.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="support_email">{fieldLabels.support_email}</label>
                        <InputText id="support_email" value={formData.support_email} onChange={(event) => updateFormField('support_email', event.target.value)} />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="address">{fieldLabels.address}</label>
                        <InputText id="address" value={formData.address} onChange={(event) => updateFormField('address', event.target.value)} />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="admission_period">{fieldLabels.admission_period}</label>
                        <InputText id="admission_period" value={formData.admission_period} onChange={(event) => updateFormField('admission_period', event.target.value)} />
                    </div>

                    <div className="col-12">
                        <div className="text-900 font-semibold mb-3">Statistics</div>
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="stat_years_experience">{fieldLabels.stat_years_experience}</label>
                        <InputText id="stat_years_experience" value={formData.stat_years_experience} onChange={(event) => updateFormField('stat_years_experience', event.target.value)} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="stat_students_info">{fieldLabels.stat_students_info}</label>
                        <InputText id="stat_students_info" value={formData.stat_students_info} onChange={(event) => updateFormField('stat_students_info', event.target.value)} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="stat_awards_info">{fieldLabels.stat_awards_info}</label>
                        <InputText id="stat_awards_info" value={formData.stat_awards_info} onChange={(event) => updateFormField('stat_awards_info', event.target.value)} />
                    </div>

                    <div className="col-12">
                        <div className="text-900 font-semibold mb-3">Content</div>
                    </div>
                    <div className="field col-12">
                        <label htmlFor="footer_description">{fieldLabels.footer_description}</label>
                        <InputTextarea id="footer_description" value={formData.footer_description} onChange={(event) => updateFormField('footer_description', event.target.value)} rows={4} autoResize />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="about_section_quote">{fieldLabels.about_section_quote}</label>
                        <InputTextarea id="about_section_quote" value={formData.about_section_quote} onChange={(event) => updateFormField('about_section_quote', event.target.value)} rows={4} autoResize />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Delete site content" visible={deleteVisible} draggable={false} onHide={() => setDeleteVisible(false)} footer={deleteFooter} style={{ width: 'min(92vw, 30rem)' }}>
                <div className="flex flex-column gap-3">
                    <p className="m-0">Are you sure you want to delete this site content?</p>
                    <div className="surface-100 border-round p-3 line-height-3">{selectedSiteContent ? `Site content #${selectedSiteContent.id}` : '-'}</div>
                </div>
            </Dialog>
        </>
    );
};

export default SiteContentPage;
