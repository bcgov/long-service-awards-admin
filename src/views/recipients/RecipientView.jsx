/*!
 * View Recipient Record
 * File: RecipientView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import MilestoneData from "@/views/recipients/data/MilestoneData.jsx";
import ProfileData from "@/views/recipients/data/ProfileData.jsx";
import ContactData from "@/views/recipients/data/ContactData.jsx";
import AwardData from "@/views/recipients/data/AwardData.jsx";
import SupervisorData from "@/views/recipients/data/SupervisorData.jsx";
import {Message} from "primereact/message";
import AdminData from "@/views/recipients/data/AdminData";

/**
 * Panel Header for common component management in registration flow
 */

export default function RecipientView({data}) {

    const {service, status} = data || {};
    const {confirmed} = service || {};

    return <div>
        { status !== 'archived'
            ? <Message
                className={'mb-3 w-full'}
                severity={confirmed ? 'success' : 'warn'}
                text={confirmed ? 'Registration Confirmed' : 'Registration In Progress'}
            />
            : <Message
                className={'mb-3 w-full'}
                severity={'info'}
                text={'Archived Registration'}
            />
        }
        <AdminData data={data} />
        <ProfileData data={data} />
        <MilestoneData data={data} />
        <ContactData data={data} />
        <AwardData data={data} />
        <SupervisorData data={data} />
    </div>
}