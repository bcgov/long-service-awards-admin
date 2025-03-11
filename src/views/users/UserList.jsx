/*!
 * List Admin Users
 * File: UserList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useState } from "react";
import {useAPI} from "@/providers/api.provider.jsx";
import DataList from "@/views/default/DataList";
import UserView from "@/views/users/UserView.jsx";
import UserEdit from "@/views/users/UserEdit.jsx";
import DataEdit from "@/views/default/DataEdit.jsx";
import {useUser} from "@/providers/user.provider.jsx";
import {formatDate} from "@/services/utils.services.js";

import { Dialog } from "primereact/dialog";
import UserMigration from "@/views/users/UserMigration.jsx";

/**
 * Inherited model component
 */

export default function UserList() {

    const api = useAPI();
    const user = useUser();

    const [selectedUser, setSelectedUser] = useState(null);
    const [showDialog, setShowDialog] = useState(null);
    const [migrationTitle, setMigrationTitle] = useState(null);

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
        const _cancel = async () => { callback(); } // PSA-525 callback actually closes the popup
        return <DataEdit
            loader={_loader}
            save={_save}
            remove={_remove}
            cancel={_cancel}
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

    /*
        LSA-540 Try to remove a User. If it fails due to keyConstraint the new Migrate popup is displayed.
    */

    const removeUser = async (dataRow) => {

        setSelectedUser(dataRow);

        const [error, result] = await api.removeUser(dataRow);

        if ( error != null ) {

            setMigrationTitle("The user has existing recipients. Before deleting the user, first select a user to whom the exiting recipients must be migrated.");
            setShowDialog("migrate");
            return Promise.reject(['keyConstraint', result]);
        } else {
            
            return Promise.resolve([]);
        }
    }

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

    return <>
                <Dialog
                    visible={showDialog === "migrate"}
                    onHide={() => setShowDialog(null)}
                    onClick={(e) => {
                       e.stopPropagation();
                    }}
                    header={"Migrate user's recipients"}
                    position="center"
                    closable
                    modal
                    breakpoints={{ "960px": "80vw" }}
                    style={{ width: "50vw" }}
                >

                    <UserMigration userId={selectedUser} setShowDialog={setShowDialog} title={migrationTitle} />
                </Dialog>
               
                <DataList
                    idKey={'id'}
                    title={'Users'}
                    schema={schema}
                    loader={api.getUsers}
                    remove={removeUser}
                    edit={editTemplate}
                    view={viewTemplate}
                />
            </>
}