/*!
 * LSA.Admin.Components.UserRegistration
 * File: UserRegister.jsx
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

export default function UserRegister({callback}) {

    const defaultValues = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_repeat: ''
    }
    // init login form
    const {
        control,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        watch } = useForm({ defaultValues, mode: "onBlur" });
    const auth = useAuth();
    let pwd = watch("password");

    // submit login credentials / redirect to dashboard
    const onSubmit = async (data) => {
        await auth.register(data);
        reset();
        // reload window
        window.location.reload();
        callback();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="contacter">
            <div className="surface-card border-round shadow-2 p-2">
                <p className="text-900 text-2xl font-medium mb-4 block">
                    Long Service Awards Admin Portal
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="p-grid">
                        <div className="field col-12">
                        <span className="p-float-label p-input-icon-right">
                            <Controller
                                name={'first_name'}
                                control={control}
                                rules={{
                                    required: 'First Name is required'
                                }}
                                render={({ field, fieldState: {error} }) => (
                                    <>
                                        <InputText
                                            id={field.name}
                                            value={field.value || ''}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            aria-describedby={`first-name-register-help`}
                                            className={classNames({"p-invalid": error})}
                                            placeholder={'Enter your first name'}
                                        />
                                        <label
                                            htmlFor="email"
                                            className={classNames({ 'p-error': error })}
                                        >First Name</label>
                                    </>
                                )} />

                        </span>
                            {getFormErrorMessage('first_name')}
                        </div>
                        <div className="field col-12">
                        <span className="p-float-label p-input-icon-right">
                            <Controller
                                name={'last_name'}
                                control={control}
                                rules={{
                                    required: 'Last Name is required'
                                }}
                                render={({ field, fieldState: {error} }) => (
                                    <>
                                        <InputText
                                            id={field.name}
                                            value={field.value || ''}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            aria-describedby={`first-name-register-help`}
                                            className={classNames({"p-invalid": error})}
                                            placeholder={'Enter your last name'}
                                        />
                                        <label
                                            htmlFor="last_name"
                                            className={classNames({ 'p-error': error })}
                                        >Last Name</label>
                                    </>
                                )} />
                        </span>
                            {getFormErrorMessage('last_name')}
                        </div>
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
                                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                            aria-describedby={`email-login-help`}
                                            className={classNames({"p-invalid": error})}
                                            placeholder={'Enter your account email address'}
                                        />
                                        <label
                                            htmlFor="email"
                                            className={classNames({ 'p-error': error })}
                                        >Email</label>
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
                                    required: 'Password is required.',
                                    pattern: {
                                        value: matchers.password,
                                        message: `Passwords must have minimum ten characters, at least one uppercase letter, 
                                        one lowercase letter, one number and one special character`
                                    }
                                }}
                                render={({ field, fieldState:{error} }) => (
                                    <>
                                        <Password
                                            id={field.name}
                                            {...field}
                                            feedback={false}
                                            className={classNames({"p-invalid": error})}
                                        />
                                        <label
                                            htmlFor="password"
                                            className={classNames({ 'p-error': error })}
                                        >Password*</label>
                                    </>
                                )} />

                        </span>
                        {getFormErrorMessage('password')}
                    </div>
                    <div className="field col-12">
                        <span className="p-float-label">
                            <Controller
                                name="password_repeat"
                                control={control}
                                rules={{
                                    required: "You must specify a password",
                                    validate: value => value === pwd || "The passwords do not match"
                                }}
                                render={({ field, fieldState:{error} }) => (
                                    <>
                                        <Password
                                            id={field.name}
                                            {...field}
                                            className={classNames({"p-invalid": error})}
                                            placeholder={"Enter your password again."}
                                            feedback={false}
                                        />
                                        <label
                                            htmlFor="password_repeat"
                                            className={classNames({ 'p-error': !!errors.password })}
                                        >Repeat Password</label>
                                    </>
                                )} />
                        </span>
                        {getFormErrorMessage('password_repeat')}
                    </div>
                    <div className="field col-12">
                        <Button disabled={!isValid} type="submit" label="Register" />
                    </div>
                </form>
            </div>
        </div>
    );
}
