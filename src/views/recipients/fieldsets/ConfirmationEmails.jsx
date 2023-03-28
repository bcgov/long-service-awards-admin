/*!
 * Registration Confirmation Emails component
 * File: ConfirmationEmails.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useFormContext, useWatch} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {ConfirmDialog} from "primereact/confirmdialog";
import {Button} from "primereact/button";
import {useStatus} from "@/providers/status.provider.jsx";
import {Panel} from "primereact/panel";
import {useAPI} from "@/providers/api.provider.jsx";

/**
 * Registration confirmation input component.
 * @returns {JSX.Element},
 */

export default function ConfirmationEmails({visible=false}) {

    // set local states
    const api = useAPI();
    const status = useStatus();
    const [showDialog, setShowDialog] = useState(false);
    const { getValues } = useFormContext();
    const isConfirmed = useWatch({name: 'service.confirmed'});

    // show email confirmation on submission
    useEffect(() => {
        setShowDialog(visible)
    }, [visible])

    /**
     * Send confirmation emails to recipient and supervisor
     */

    const _sendMail = async (e) => {
        if (e) e.preventDefault();
        status.setMessage('mail');
        api.sendMail('reg-confirm', getValues())
            .then(([error, ]) => {
                if (error) status.setMessage('mailError');
                else status.setMessage('mailSuccess');
            })
            .catch(error => {
                console.error(error)
                status.setMessage('mailError');
            });
    }

    return <>
        {
            isConfirmed && visible && <Panel className={'mb-3'} collapsed={false} toggleable={false} header={'Send Confirmation Emails'}>
                <Button
                    className={'w-full'}
                    onClick={_sendMail}
                    icon={'pi pi-envelope'}
                    label={'Send Confirmation Emails'}
                />
            </Panel>
        }
        <ConfirmDialog
            header="Email Confirmation"
            visible={showDialog}
            onHide={() => setShowDialog(false)}
            onClick={(e)=>{e.stopPropagation()}}
            message="Send registration confirmation emails to recipient and supervisor?"
            icon="pi pi-envelope"
            accept={_sendMail}
            reject={() => setShowDialog(false)}
        />
    </>
}
