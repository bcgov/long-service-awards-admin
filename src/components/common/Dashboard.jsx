/*!
 * LSA.Admin.Components.Dashboard
 * File: Dashboard.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import PageHeader from "@/components/common/PageHeader.jsx";
import {DataView} from "primereact/dataview";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import {useUser} from "@/providers/user.provider.jsx";

function Dashboard() {

    const navigate = useNavigate();
    const user = useUser();
    const { authenticated, role } = user || {};

    const items = [
        {
            route: '/recipients',
            label: 'Manage Recipients',
            description: 'Award/Service Pin recipient records.'
        },
        {
            route: '/reports',
            label: 'Manage Reports',
            description: 'View and download reports.'
        },
        {
            route: '/ceremonies',
            label: 'Manage Ceremonies',
            description: 'Add and edit ceremonies.',
            authorizedRoles: [
                "administrator",
                "super-administrator"
            ]
        },
    ]

    /**
     * Select item from grid display
     * */

    const itemTemplate = (item) => {

        // LSA-526 Limit display of items based on authorizedRoles. If there are no roles defined, default to allowed.

        if ( item.authorizedRoles && Array.isArray(item.authorizedRoles) ) {

            const isAuthorized = authenticated
                && ((role && role.name === 'super-administrator')
                    || (role && (item.authorizedRoles || []).includes(role.name)));

            if ( !isAuthorized ) return null;
        }

        return <div className="col-4 sm:col-6 md:col-4 lg:col-4 xl:col-4 p-2">
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <div className="text-2xl font-bold">{item.label}</div>
                    <div style={{textAlign: 'left'}}>{item.description}</div>
                    <div>
                        <Button className={'w-95'} onClick={() => {navigate(item.route)}}>
                            {item.label}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    };

    return <div className={'container'}>
        <PageHeader heading={'Admin Dashboard'} subheading={''} />
        <DataView
            value={items}
            layout={'grid'}
            itemTemplate={itemTemplate}
            rows={9}
        />
    </div>
}

export default Dashboard;