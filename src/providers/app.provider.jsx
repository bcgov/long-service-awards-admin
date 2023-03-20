/*!
 * LSA.Admin.Provider.App
 * File: app.provider.client.js
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import React from 'react';
import { AuthProvider } from './auth.provider.jsx';
import { UserProvider } from './user.provider.jsx';
import {StatusProvider} from "@/providers/status.provider.jsx";
import {APIProvider} from "@/providers/api.provider";

function AppProviders({ children }) {
    return (
        <StatusProvider>
            <APIProvider>
                <AuthProvider>
                    <UserProvider>
                            {children}
                    </UserProvider>
                </AuthProvider>
            </APIProvider>
        </StatusProvider>
    );
}

export default AppProviders;