/*!
 * List Admin Users
 * File: UserList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useAPI} from "@/providers/api.provider.jsx";
import DataList from "@/views/default/DataList";
import UserView from "@/views/users/UserView.jsx";
import UserEdit from "@/views/users/UserEdit.jsx";
import DataEdit from "@/views/default/DataEdit.jsx";
import {useUser} from "@/providers/user.provider.jsx";
import {formatDate} from "@/services/utils.services.js";

/**
 * Panel Header for common component management in registration flow
 */

export default function UserList() {

    const api = useAPI();
    const user = useUser();

    const roleTemplate = (rowData) => {
        const {role} = rowData || {};
        return <div>{role.label}</div>
    }

    const defaults = {
        email: "",
        first_name: "",
        last_name: "",
        organizations: [],
        role: {}
    }

    const orgTemplate = (rowData) => {
        const {organizations} = rowData || {};
        return <div className={'grid'}>{
            (organizations || []).length > 0
                ? (organizations || []).map(({organization}) =>
                    <div key={organization.name} className={'col-12'}>{organization.abbreviation}</div>
                )
                : <div className={'col-12'}>-</div>
            }</div>
    }

    // build edit form template
    const editTemplate = (data, callback) => {
        const {id} = data || {};
        const _loader = async () => api.getUser(id);
        const _save = async (submission) => api.saveUser(submission).finally(callback);
        // You cannot delete yourself.
        const _remove = id === user.id ? null : async () => api.removeUser(id);
        return <DataEdit
            loader={_loader}
            save={_save}
            remove={_remove}
            defaults={{...defaults, ...data}}><UserEdit /></DataEdit>
    }

    /**
     * Date templates
     * */

    const updatedDateTemplate = (rowData) => {
        return formatDate(rowData.updated_at);
    };

    const createdDateTemplate = (rowData) => {
        return formatDate(rowData.created_at);
    };

    /**
     * View record data template
     * */

    const viewTemplate = (data) => <UserView data={data} />

    const schema = [
        {
            name: 'first_name',
            input: 'text',
            label: "First Name",
            sortable: true
        },
        {
            name: 'last_name',
            input: 'text',
            label: "Last Name",
            sortable: true
        },
        {
            name: 'role',
            input: 'multiselect',
            label: "Role",
            body: roleTemplate,
            sortable: false
        },
        {
            name: 'organizations',
            input: 'multiselect',
            label: "Organizations",
            body: orgTemplate,
            sortable: false
        },
        {
            name: 'updated_at',
            label: "Updated",
            body: updatedDateTemplate,
            sortable: false
        },
        {
            name: 'created_at',
            label: "Created",
            body: createdDateTemplate,
            sortable: false
        },
    ];

    return <DataList
            schema={schema}
            loader={api.getUsers}
            remove={api.removeUser}
            edit={editTemplate}
            view={viewTemplate}
        />
}