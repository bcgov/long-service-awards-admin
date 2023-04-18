/*!
 * User Request Password Request
 * File: UserRequestPasswordRequest.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {useAuth} from "../../providers/auth.provider.jsx";
import {matchers} from "@/services/validation.services.js";
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {Button} from "primereact/button";

function UserRequestPasswordReset({callback}) {

    const defaultValues = { email: '' };

    // init login form
    const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });
    const auth = useAuth();
    const [showDialog, setShowDialog] = useState(null);

    // submit login credentials / redirect to dashboard
    const onSubmit = async (data) => {
        const response = await auth.requestPasswordReset(data);
        setShowDialog('confirmation');
        callback();
    };

    const onCancel = () => {
        setShowDialog(null);
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <>
            <Dialog
                header="Password Reset Request Sent"
                visible={showDialog === 'confirmation'}
                style={{ width: '50vw' }}
                onHide={onCancel}
            >
                <p className="m-0">
                    A password reset link has been sent to your user email inbox.
                </p>
            </Dialog>

            <div className="request-password-reset-form">
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="p-grid">
                        <div className="field col-12">
                        <span className="p-float-label p-input-icon-right">
                            <i className="pi pi-envelope" />
                            <Controller
                                name={'email'}
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: matchers.govEmail,
                                        message: 'Invalid email address. (e.g., example@gov.bc.ca)'
                                    }
                                }}
                                render={({ field, fieldState: {error} }) => (
                                    <>
                                        <InputText
                                            id={field.name}
                                            value={field.value || ''}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            aria-describedby={`email-login-help`}
                                            className={classNames({"p-invalid": error})}
                                            placeholder={'Enter your account email address'}
                                        />
                                        <label
                                            htmlFor="email"
                                            className={classNames({ 'p-error': !!errors.email })}
                                        >Email*</label>
                                    </>
                                )} />

                        </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field col-12">
                            <Button
                                type="submit"
                                label="Request Password Reset"
                                icon="pi pi-envelope"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UserRequestPasswordReset;