/*!
 * LSA.Admin.Components.Menubar
 * File: Menubar.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import React from 'react';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from "primereact/sidebar";
import { Avatar} from "primereact/avatar";
import logoURL from '../../assets/images/BCID_H_rgb_rev.png';
import {useUser} from "@/providers/user.provider.jsx";
import {useAuth} from "@/providers/auth.provider.jsx";
import {useNavigate} from "react-router-dom";

function MenuBar() {

    const user = useUser();
    const auth = useAuth();
    const navigate = useNavigate();
    const {
        authenticated,
        first_name,
        last_name,
        email,
        idir,
        organizations=[],
        role
    } = user || {};

    const [showDialog, setShowDialog] = React.useState(null);

    // check if user is authorized to access menu items
    const isAuthorized = authenticated
        && ['administrator', 'super-administrator', 'org-contact'].includes(role.name);

    // check if user is authorized to access menu items
    const isAdmin = authenticated
        && ['administrator', 'super-administrator'].includes(role.name);

    // check if user is authorized to access menu items
    const isSuperAdmin = authenticated && role.name === 'super-administrator';

    const logo = <img alt="logo" src={logoURL} height="60" className="mr-2"></img>;
    const profile = () => {
        // check if user is registered and/or is authenticated
        const {id} = user || {};
        return (authenticated || id) && <Button
                label={idir}
                icon="pi pi-user"
                onClick={() => setShowDialog('profile')}
            />
    }

    // unauthenticated menu items
    let items = [
        {
            label: 'Long Service Awards',
            icon: 'pi pi-fw pi-home',
            url: import.meta.env.LSA_APPS_ADMIN_URL
        },
        {
            label:'About',
            icon:'pi pi-fw pi-info-circle',
            url: import.meta.env.LSA_APPS_MAIN_SITE_URL
        },
    ];

    // authorized menu items
    let protectedItems = [];

    // add protected authorized menu
    if (isAuthorized) {
        protectedItems.push.apply(protectedItems,
            [
                {
                    label:'Recipients',
                    icon:'pi pi-fw pi-users',
                    url: `${import.meta.env.LSA_APPS_ADMIN_URL}/recipients`
                },
                {
                    label:'Reports',
                    icon:'pi pi-fw pi-list',
                    url: `${import.meta.env.LSA_APPS_ADMIN_URL}/reports`
                }
            ]
        )
    }

    // add protected admin menu
    if (isAdmin) {
        protectedItems.push.apply(protectedItems,
            [
                {
                    label:'Awards',
                    icon:'pi pi-fw pi-gift',
                    url: `${import.meta.env.LSA_APPS_ADMIN_URL}/awards`
                },
                {
                    label:'Ceremonies',
                    icon:'pi pi-fw pi-calendar',
                },
                {
                    label:'Users',
                    icon:'pi pi-fw pi-users',
                    url: `${import.meta.env.LSA_APPS_ADMIN_URL}/users`
                },
                {
                    label:'Organizations',
                    icon:'pi pi-fw pi-building\n',
                    url: `${import.meta.env.LSA_APPS_ADMIN_URL}/organizations`
                },
            ]
        )
    }

    // add protected super-admin menu
    if (isSuperAdmin) {
        protectedItems.push.apply(protectedItems,
            [
                {
                    label:'Settings',
                    icon:'pi pi-fw pi-cog',
                    items:[
                        {
                            label:'Permissions',
                            icon:'pi pi-fw pi-lock'
                        },
                        {
                            label:'Global Settings',
                            icon:'pi pi-fw pi-cog',
                            url: `${import.meta.env.LSA_APPS_ADMIN_URL}/settings`
                        },

                    ]
                }
            ]
        )
    }

    // add authorized menu items
    if (isAuthorized) {
        items.push.apply(items,
            [{
                label:'Menu',
                items: protectedItems
            }]
        )
    }

    // add logout for authenticated users
    if (authenticated) {
        items.push.apply(items,
            [{
                    label:'Logout',
                    icon:'pi pi-fw pi-power-off',
                    command: () => {auth.logout().then(() => {navigate('/')})}
                }]
        )
    }

    return (
        <>
        <Sidebar visible={showDialog === 'profile'} onHide={() => setShowDialog(null)}>
            {
                !user || !authenticated
                    ? <div>You are registered but are not logged in.</div>
                    :
                    <>
                        <div className="grid fluid">
                            <div className="col-3"><Avatar icon="pi pi-user" size="large"/></div>
                            <div className="col-9"><h3>{idir}</h3></div>
                            <div className="col-4"><b>Name:</b></div>
                            <div className="col-8">{first_name} {last_name}</div>
                            <div className="col-4"><b>Email:</b></div>
                            <div className="col-8">{email}</div>
                            <div className="col-4"><b>Role:</b></div>
                            <div className="col-8">{role.label}</div>
                            <div className="col-4"><b>Orgs:</b></div>
                            {
                                !organizations || (organizations || []).length === 0 &&
                                <div className="col-8">N/A</div>
                            }
                            <div className="col-8">{
                                (organizations || []).map((orgData, index) => {
                                    const {organization} = orgData || {};
                                    return <div key={`profile_org_${index}`}>{organization.abbreviation}</div>})
                            }</div>
                        </div>
                    </>
            }
        </Sidebar>
        <Menubar
            model={items}
            start={logo}
            end={profile}
        />
        </>
    );
}

export default MenuBar;