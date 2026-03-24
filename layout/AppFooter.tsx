import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/layout/images/logo/footer-${layoutConfig.colorScheme === 'light' ? 'ultima' : 'ultima-dark'}.svg`} alt="ultima-footer-layout" />
            <div className="flex gap-2">
                <Button type="button" icon="pi pi-github" rounded text className="p-button-plain"></Button>
                <Button type="button" icon="pi pi-facebook" rounded text className="p-button-plain"></Button>
                <Button type="button" icon="pi pi-twitter" rounded text className="p-button-plain"></Button>
            </div>
        </div>
    );
};

export default AppFooter;
