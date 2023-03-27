/*!
 * Default Edit Record
 * File: DataEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

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
            if (error) status.setMessage('deleteError');
            else status.setMessage('delete');
            if (!error && result) return result;
        } catch (error) {
            status.clear();
            status.setMessage('deleteError');
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
            remove={remove ? _handleDelete : null}
        >
            {children}
        </FormContext>
    </>
}