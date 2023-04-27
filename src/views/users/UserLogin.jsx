/*!
 * LSA.Admin.Components.Login
 * File: Login.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import {useAuth} from "../../providers/auth.provider.jsx";
import {matchers} from "@/services/validation.services.js";
import {useNavigate} from "react-router-dom";
import {useUser} from "@/providers/user.provider.jsx";
import {BlockUI} from "primereact/blockui";
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import UserRegister from "@/views/users/UserRegister.jsx";
import UserRequestPasswordReset from "@/views/users/UserRequestPasswordReset";

function UserLogin() {

    const defaultValues = {
        email: '',
        password: '',
    }
    // init login form
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    const auth = useAuth();
    const user = useUser();
    const {id, authenticated, role} = user || {};
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(null);

    // submit login credentials / redirect to dashboard
    const onSubmit = async (data) => {
        const isLoggedIn = await auth.login(data);
        reset();
        if (isLoggedIn) navigate('/')
    };

    const onCancel = () => {
        setShowDialog(null);
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    // check if user is awaiting approval for admin account
    const isRegistrant = authenticated && role.name === 'inactive';

    const blockedTemplate = () => {
        return isRegistrant
            ? <Button
                className={'p-button-help'}
                onClick={() => setShowDialog('confirmation')}
                icon={'pi pi-lock p-button-help'}
                label={'Account Waiting Approval'}
            />
            : <Button
                className={'p-button-help'}
                disabled={true}
                icon={'pi pi-lock'}
                label={'You Are Logged In'}
            />
    }

    return (
        <>
            <Dialog
                header="Account Waiting Approval"
                visible={showDialog === 'confirmation'} style={{ width: '50vw' }}
                onHide={onCancel}
            >
                <p className="m-0">
                    We have received your registration to the LSA admin portal. Once we have reviewed the request, we will
                    notify you of the status of your account.
                </p>
            </Dialog>

            <Dialog
                visible={showDialog === 'registration'}
                onHide={onCancel}
                onClick={(e)=>{e.stopPropagation()}}
                header={"User Registration"}
                position="center"
                closable
                maximizable
                modal
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '50vw' }}
            >
                <UserRegister callback={onCancel} />
            </Dialog>

            <Dialog
                visible={showDialog === 'reset-password'}
                onHide={onCancel}
                onClick={(e)=>{e.stopPropagation()}}
                header={"Send Reset Password Request"}
                position="center"
                closable
                maximizable
                modal
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '50vw' }}
            >
                <UserRequestPasswordReset callback={onCancel} />
            </Dialog>

            <BlockUI baseZIndex={1} blocked={authenticated} template={blockedTemplate}>
                <div className="login-form">
                    <div className="surface-card border-round shadow-2 p-4 mb-3">
                        <p className="text-900 text-2xl font-medium mb-4 block">
                            Sign In: Long Service Awards Admin
                        </p>
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
                            </div>
                            <div className="field col-12">
                        <span className="p-float-label">
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    value: matchers.password,
                                    required: 'Password is required.'
                                }}
                                render={({ field, fieldState:{error} }) => (
                                    <Password
                                        id={field.name}
                                        {...field}
                                        feedback={false}
                                        toggleMask
                                        className={classNames({"p-invalid": error})}
                                    />
                                )} />
                            <label
                                htmlFor="password"
                                className={classNames({ 'p-error': !!errors.password })}
                            >Password*</label>
                        </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <div className="field col-12">
                                <Button
                                    type="submit"
                                    label="Sign In"
                                    icon="pi pi-sign-in"
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="grid">
                    <div className={'col-6'}>
                        <div className="mb-3 surface-card border-round shadow-2 p-4">
                            <p className="text-900 text-xl font-medium mb-4 block">
                                Register for Account
                            </p>
                            <div className="container m-3">
                                <Button
                                    className={'p-button-secondary w-full'}
                                    label={id ? "Registered" : "Register"}
                                    disabled={!!id}
                                    icon="pi pi-user-plus"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDialog('registration')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="surface-card border-round shadow-2 p-4">
                            <p className="text-900 text-xl font-medium mb-4 block">
                                Reset Your Password
                            </p>
                            <div className="container m-3">
                                <Button
                                    disabled={false}
                                    className={'p-button-secondary w-full'}
                                    label={"Reset Password"}
                                    icon="pi pi-envelope"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDialog('reset-password')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>
        </>
    );
}

export default UserLogin;