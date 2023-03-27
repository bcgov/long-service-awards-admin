/*!
 * Global settings management view
 * File: AwardList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import DataList from "@/views/default/DataList";
import DataEdit from "@/views/default/DataEdit.jsx";
import SettingView from "@/views/settings/SettingView.jsx";
import SettingEdit from "@/views/settings/SettingEdit.jsx";
import {useAuth} from "@/providers/auth.provider.jsx";

/**
 * Inherited model component
 */

export default function SettingList() {

    const api = useAuth();

    // build edit form template
    const editTemplate = (data, callback) => {
        const {name} = data || {};
        const _loader = async () => api.getSetting(name);
        const _save = async (data) => api.updateSetting(data).finally(callback);
        // delete global setting not enabled
        const _remove = async () => api.deleteSetting(name);
        return <DataEdit loader={_loader} save={_save} remove={_remove} defaults={data}><SettingEdit /></DataEdit>
    }

    const viewTemplate = (data) => <SettingView data={data} />

    const schema = [
        {
            name: 'label',
            input: 'text',
            label: "Label",
            sortable: true
        },
        {
            name: 'value',
            input: 'text',
            label: "Value",
            sortable: true
        }
    ];

    return <DataList
        idKey={'name'}
        title={'Settings'}
        schema={schema}
        loader={api.getSettings}
        edit={editTemplate}
        view={viewTemplate}
    />
}