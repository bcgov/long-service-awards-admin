/*!
 * Main application root.
 * File: main.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AppProvider from "./providers/app.provider.jsx"
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "./index.css";
import NotFound from "@/components/common/NotFound.jsx";
import ServerError from "@/components/common/ServerError.jsx";
import UserLogin from "@/views/users/UserLogin.jsx";
import APIBoundary from "@/components/common/APIBoundary.jsx";
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx";
import Dashboard from "@/components/common/Dashboard.jsx";
import RecipientList from "@/views/recipients/RecipientList";
import RecipientEdit from "@/views/recipients/RecipientEdit.jsx";
import UserList from "@/views/users/UserList";
import AwardList from "@/views/awards/AwardList";
import SettingList from "@/views/settings/SettingList";
import OrganizationList from "@/views/organizations/OrganizationList";
import UserPasswordReset from "@/views/users/UserPasswordReset";
import ReportList from "@/views/reports/ReportList";

// init main router
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <APIBoundary />,
        children: [
            {
                path: "/",
                element: <ProtectedRoute
                    authorizedRoles={['administrator', 'super-administrator', 'org-contact']}>
                    <Dashboard />
                </ProtectedRoute>,
            },
            {
                path: "login",
                element: <UserLogin />,
            },
            {
                path: "password-reset/:token",
                element: <UserPasswordReset />
            },
            {
                path: "recipients",
                element: <ProtectedRoute
                    authorizedRoles={['administrator', 'super-administrator', 'org-contact']}>
                    <RecipientList />
                </ProtectedRoute>,
            },
            {
                path: "recipients/edit/:id",
                element: <ProtectedRoute
                    authorizedRoles={['administrator', 'super-administrator', 'org-contact']}>
                    <RecipientEdit />
                </ProtectedRoute>,
            },
            {
                path: "users",
                element: <ProtectedRoute authorizedRoles={['administrator', 'super-administrator']}>
                    <UserList />
                </ProtectedRoute>,
            },
            {
                path: "awards",
                element: <ProtectedRoute authorizedRoles={['administrator']}>
                    <AwardList />
                </ProtectedRoute>,
            },
            {
                path: "reports",
                element: <ProtectedRoute authorizedRoles={['org-contact']}>
                    <ReportList />
                </ProtectedRoute>,
            },
            {
                path: "ceremonies",
                element: <ProtectedRoute authorizedRoles={['administrator']}>
                    <h1>Ceremonies (In Development)</h1>
                </ProtectedRoute>,
            },
            {
                path: "organizations",
                element: <ProtectedRoute authorizedRoles={['administrator']}>
                    <OrganizationList />
                </ProtectedRoute>,
            },
            {
                path: "settings",
                element: <ProtectedRoute authorizedRoles={['super-administrator']}>
                    <SettingList />
                </ProtectedRoute>,
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ]

    },
],{ basename: import.meta.env.LSA_APPS_ADMIN_BASE });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider>
            <RouterProvider router={router} fallbackElement={<ServerError />} />
        </AppProvider>
    </React.StrictMode>
);