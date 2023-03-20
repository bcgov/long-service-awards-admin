/*!
 * Recipient Administrative Data
 * File: AdminData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";

/**
 * Recipient Profile Details
 */

export default function AdminData({data}) {

    const {status, user, idir, notes, updated_at, created_at} = data || {};
    const updatedData = updated_at ? new Date(updated_at) : null;
    const createdDate = created_at ? new Date(created_at) : null;

    return <Panel className={'mb-2 mt-2'} header={'Recipient Administration'} toggleable>
        <div className={'container'}>
            <div className={'grid'}>
                <div className={'col-6'}>Registration Type</div>
                <div className={'col-6'}>{status || '-'}</div>
                <div className={'col-6'}>Delegated Registrant</div>
                <div className={'col-6'}>{user ? user.idir : '-'}</div>
                <div className={'col-6'}>Recipient IDIR</div>
                <div className={'col-6'}>{idir || '-'}</div>
                <div className={'col-12'}>Notes</div>
                <div className={'surface-hover col-12'}>{notes || ' '}</div>
                <div className={'col-6'}>Last Updated</div>
                <div className={'col-6'}>
                    {updatedData ? updatedData.toLocaleString() : '-'}
                </div>
                <div className={'col-6'}>Date Created</div>
                <div className={'col-6'}>
                    {createdDate ? createdDate.toLocaleString() : '-'}
                </div>
        </div>
        </div>
    </Panel>
}
