/*!
 * LSA.Admin.Components.ProtectedRoute
 * File: ProtectedRoute.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import {useUser} from "@/providers/user.provider.jsx";
import {Navigate} from "react-router-dom"
import {useStatus} from "@/providers/status.provider.jsx";

const ProtectedRoute = ({children, authorizedRoles=[]}) => {
    const user = useUser();
    const { loading } = useStatus();
    const { authenticated, role } = user || {};

    // check if user is authorized for this route based on role
    const isAuthorized = authenticated
        && ((role && role.name === 'super-administrator')
            || (role && (authorizedRoles || []).includes(role.name)));

    // redirect to login page if not authenticated
    if ( !loading && user && !isAuthorized ) {
        return <Navigate to="/login" />
    }
    return loading ? <p>Loading...</p> : children;

};

export default ProtectedRoute;