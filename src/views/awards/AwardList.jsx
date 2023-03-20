/*!
 * Awards management view
 * File: AwardList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useAPI} from "@/providers/api.provider.jsx";
import DataList from "@/views/default/DataList";
import AwardView from "@/views/awards/AwardView.jsx";
import AwardEdit from "@/views/awards/AwardEdit.jsx";
import DataEdit from "@/views/default/DataEdit.jsx";

/**
 * Panel Header for common component management in registration flow
 */

export default function AwardList() {

    const api = useAPI();

    const optionsTemplate = (rowData) => {
        const {options=[]} = rowData || {};
        return <div className={'grid'}>{
            (options || []).map(({option}) => <div key={option.name} className={'col-12'}>{option.label}</div>)
        }</div>
    }

    // build edit form template
    const editTemplate = (data, callback) => {
        const {id} = data || {};
        const _loader = async () => api.getAward(id);
        const _save = async (data) => api.saveAward(data).finally(callback);
        const _remove = async () => api.removeAward(id);
        return <DataEdit loader={_loader} save={_save} remove={_remove} defaults={data}><AwardEdit /></DataEdit>
    }

    const viewTemplate = (data) => <AwardView data={data} />

    const schema = [
        {
            name: 'type',
            input: 'select',
            label: "Award Type",
            sortable: true
        },
        {
            name: 'milestone',
            input: 'text',
            label: "Milestone",
            sortable: true
        },
        {
            name: 'label',
            input: 'text',
            label: "Label",
            sortable: true
        },
        {
            name: 'vendor',
            input: 'text',
            label: "Vendor Code",
            sortable: true
        },
    ];

    return <DataList
            schema={schema}
            loader={api.getAwards}
            remove={api.removeAward}
            edit={editTemplate}
            view={viewTemplate}
            options={optionsTemplate}
        />
}