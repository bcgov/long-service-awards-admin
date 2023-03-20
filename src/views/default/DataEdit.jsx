/*!
 * Default Edit Record
 * File: DataEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import PageHeader from "@/components/common/PageHeader.jsx";
import {useStatus} from "@/providers/status.provider.jsx";
import FormContext from "@/components/common/FormContext";

/**
 * Default edit form component for record data
 */

export default function DataEdit({loader, save, remove, defaults, children}) {

    const status = useStatus();

    // create new record
    const _handleDelete = async (id) => {
        try {
            const [error, result] = await remove(id);
            if (error) status.setMessage({message: "Error: Could Not Delete Record", severity: "danger"});
            else status.setMessage({message: "Record Deleted!", severity: "success"});
            if (!error && result) return result;
        } catch (error) {
            status.clear();
            status.setMessage({message: "Error: Could Not Create New Record", severity: "danger"});
        }
    }

    // save record form data
    const _handleSave = async (data) => {
        try {
            status.setMessage('save');
            const [error, result] = await save(data);
            if (error) status.setMessage('saveError');
            else status.setMessage('saveSuccess');
            if (!error && result) return result;
        } catch (error) {
            status.setMessage('saveError');
        }
    };

    // loader item record data
    const _loader = async () => {
        const { result } = await loader() || {};
        return result;
    };

    return <>
        <FormContext
            defaults={defaults}
            loader={_loader}
            save={_handleSave}
            remove={_handleDelete}
        >
            {children}
        </FormContext>
    </>
}