/*!
 * Admin Notes Input fieldset component
 * File: AdminInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useEffect, useState} from "react";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import {Dialog} from "primereact/dialog";
import AwardOptionsInput from "@/views/recipients/fieldsets/AwardOptionsInput.jsx";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Skeleton} from "primereact/skeleton";
import fallbackImg from "@/assets/images/bclogo.jpg";
import {Button} from "primereact/button";
import classNames from "classnames";
import {useAPI} from "@/providers/api.provider.jsx";
import {useStatus} from "@/providers/status.provider.jsx";
import {Panel} from "primereact/panel";
import {Message} from "primereact/message";
import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";


/**
 * Award selection reusable component.
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function AdminInput() {

    // get context / hooks
    const { control } = useFormContext();

    return <Panel
        toggleable
        collapsed={true}
        header="Administration Notes"
        className={'mb-3'}
    >
        <div className="col-12 form-field-container">
            <label htmlFor={'notes'}>Notes</label>
            <Controller
                name={'notes'}
                control={control}
                render={({ field, fieldState: {invalid, error} }) => (
                    <>
                        <InputTextarea
                            autoResize
                            id={field.name}
                            value={field.value || ''}
                            className={classNames('w-full', {"p-invalid": error})}
                            aria-describedby={`award-description-help`}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={`Administrative notes for recipient record.`}
                        />
                        { invalid && <p className="error">{error.message}</p> }
                    </>
                )}
            />
        </div>
    </Panel>;
}
