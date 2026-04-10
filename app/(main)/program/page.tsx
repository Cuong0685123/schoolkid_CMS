'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { getPrograms } from '../../../demo/service/ProgramService';
import { useRouter } from 'next/navigation';

type ProgramRow = {
    id: string | number;
    name?: string;
    description?: string;
    type?: string;
};

const Program = () => {
    const toast = useRef<Toast>(null);
    const [idFrozen, setIdFrozen] = useState(false);
    const [programs, setPrograms] = useState<ProgramRow[]>([]);
    const [loading2, setLoading2] = useState(true);
    const router = useRouter();
    
    const editBodyTemplate = (rowData: ProgramRow) => (
        <Button label="Edit" link onClick={() => router.push(`/program/${rowData.id}`)}></Button>
    );

    useEffect(() => {
        setLoading2(true);

        getPrograms().then((data) => {
            setPrograms(data);
            setLoading2(false);
        });
    }, []);
    return (
        <>
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Frozen Columns</h5>
                    <ToggleButton checked={idFrozen} onChange={(e) => setIdFrozen(e.value)} onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Unfreeze Id" offLabel="Freeze Id" style={{ width: '10rem' }} />

                    <DataTable value={programs} scrollable scrollHeight="400px" loading={loading2} className="mt-3">
                        <Column field="name" header="Name" style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                        <Column field="id" header="Id" style={{ flexGrow: 1, flexBasis: '100px' }} frozen={idFrozen} alignFrozen="left" bodyClassName={classNames({ 'font-bold': idFrozen })}></Column>
                        <Column field="description" header="Description" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="type" header="Type" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column header="Actions" body={editBodyTemplate} style={{ flexGrow: 0, flexBasis: '80px' }}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default Program;