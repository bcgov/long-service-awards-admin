/*!
 * LSA.Admin.Components.UserPasswordReset
 * File: UserPasswordReset.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import {useAuth} from "../../providers/auth.provider.jsx";
import {matchers} from "@/services/validation.services.js";
import {Panel} from "primereact/panel";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useUser} from "@/providers/user.provider.jsx";
import {Message} from "primereact/message";
import {BlockUI} from "primereact/blockui";

export default function UserPasswordReset() {

    const [validToken, setValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    // get user ID and token parameters
    const { id, token } = useParams() || {};

    const defaultValues = {
        password: '',
        password_repeat: '',
        id
    }

    /**
     * Validate user token
     * */

    const validateToken = () => {
        auth.validateToken(id, token)
            .then(setValidToken)
            .catch((e) => {
                console.error(e);
                setValidToken(false)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // validate token on init
    useEffect(validateToken, []);

    // init login form
    const {
        control,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        watch
    } = useForm({ defaultValues, mode: "onBlur" });
    const auth = useAuth();
    let pwd = watch("password");

    // submit password reset / redirect to dashboard
    const onSubmit = async (data) => {
        setLoading(true);
        const isValid = await auth.validateToken(id, token);
        if (!isValid) setValidToken(false);
        const completed = await auth.resetPassword(id, token, data);
        // confirm password reset was completed
        if (completed) setSubmitted(completed);
        else setValidToken(false);
        setLoading(false);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return <Panel header={<>Long Service Awards: Password Reset</>} toggleable={false}>
        {
            !validToken && !loading &&
            <Message
                className={'w-full'}
                severity={'error'}
                text={
                    <p>User token for password reset is not valid.
                        Please <a href={`${import.meta.env.LSA_APPS_ADMIN_URL}`}>submit another request</a>.</p>
                }
            />
        }
        {
            submitted && !loading &&
            <Message
                className={'w-full'}
                severity={'success'}
                text={
                    <p>Password reset successfully! <a href={`${import.meta.env.LSA_APPS_ADMIN_URL}`}>Return to login page</a>.</p>
                }
            />
        }
        <BlockUI blocked={!validToken || loading || submitted}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div className="p-grid">
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
                        <Button disabled={!isValid} type="submit" label="Reset Password" />
                    </div>
                </div>
            </form>
        </BlockUI>
    </Panel>
}
