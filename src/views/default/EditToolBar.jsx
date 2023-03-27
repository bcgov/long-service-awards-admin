/*!
 * LSA.Admin.Components.EditToolBar
 * File: EditToolBar.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import React from 'react';
import {useUser} from "@/providers/user.provider.jsx";
import {useNavigate} from "react-router-dom";
import {ConfirmDialog} from "primereact/confirmdialog";
import {Dialog} from "primereact/dialog";
import {SplitButton} from "primereact/splitbutton";

const EditToolbar = ({loader=()=>{}, view=()=>{}, save=()=>{}, remove=null, options=null}) => {

    const user = useUser();
    // const auth = useAuth();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = React.useState(null);

    // return callback to end action
    // - close dialog and reload data
    const callback = () => {
        setShowDialog(null);
        loader();
    }

    // render view record component
    const View = () => {
        return view();
    }

    // render edit record component
    const Edit = () => {
        return save(callback);
    }

    // render options component
    const Options = () => {
        return options(callback);
    }

    // handle delete item
    const _handleDelete = () => {
        remove();
        setShowDialog(null);
    }

    // allows for navigation to edit page if 'save' is defined as a route path
    const _showEdit = () => {
        return typeof save === 'string' ? navigate(String(save)) : setShowDialog('update');
    }

    // show view dialog
    const _showView = () => {
        setShowDialog('view');
    }

    // show view dialog
    const _showDelete = () => {
        setShowDialog('delete');
    }

    // show options dialog
    const _showOptions = () => {
        setShowDialog('options');
    }

    let items = [
            {
                label:'View',
                icon:'pi pi-fw pi-eye',
                command: _showView
            },
            {
                label:'Edit',
                icon:'pi pi-fw pi-pencil',
                command: _showEdit
            }
    ];

    // include delete operation
    if (remove) {
        items.push({
            label:'Delete',
            icon:'pi pi-fw pi-trash',
            command: _showDelete
        })
    }

    // include options tool
    if (options) {
        items.push({
            label:'Options',
            icon:'pi pi-fw pi-cog',
            command: _showOptions
        })
    }

    // add protected admin menu
    if (user) {
        items.push.apply(items,
            []
        )
    }

    return (
        <>
            <Dialog
                visible={showDialog === 'view'}
                onHide={() => setShowDialog(null)}
                onClick={(e)=>{e.stopPropagation()}}
                header={"View Record"}
                position="center"
                closable
                maximizable
                modal
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '50vw' }}
            >
                <View />
            </Dialog>
            <Dialog
                visible={showDialog === 'update'}
                onHide={() => setShowDialog(null)}
                onClick={(e)=>{e.stopPropagation()}}
                header={"Edit Record"}
                position="center"
                closable
                maximizable
                modal
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '50vw' }}
            >
                <Edit />
            </Dialog>
            <Dialog
                visible={showDialog === 'options'}
                onHide={() => setShowDialog(null)}
                onClick={(e)=>{e.stopPropagation()}}
                header={"Edit Options"}
                position="center"
                closable
                maximizable
                modal
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '50vw' }}
            >
                <Options />
            </Dialog>
            <ConfirmDialog
                header="Confirmation"
                visible={showDialog === 'delete'}
                onHide={() => setShowDialog(false)}
                onClick={(e)=>{e.stopPropagation()}}
                message="Are you sure you want to delete this record?"
                icon="pi pi-exclamation-triangle"
                accept={_handleDelete}
                reject={() => setShowDialog(false)}
            />
            <SplitButton
                className={'p-button-secondary'}
                severity="secondary"
                label="View"
                icon="pi pi-eye"
                onClick={_showView}
                model={items}
            />
        </>
    );
}

export default EditToolbar;