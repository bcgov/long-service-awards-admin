/*!
 * LSA.Admin.Providers.User
 * File: user.provider.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import {Outlet} from "react-router-dom";
import {useStatus} from "@/providers/status.provider.jsx";
import MenuBar from "@/components/common/MenuBar.jsx";
import {BlockUI} from "primereact/blockui";

/**
 * Global Router provider.
 *
 * @public
 */

export default function App() {
    const {loading} = useStatus();
    return <>
        <header>
            <BlockUI blocked={loading}>
                <MenuBar />
            </BlockUI>
        </header>
        <main>
            <div className={'fluid m-2'}>
                { loading ? <p>Loading...</p> : <Outlet /> }
            </div>
        </main>
    </>;
}