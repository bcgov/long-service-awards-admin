/*!
 * LSA.Admin.Providers.User
 * File: user.provider.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import * as React from 'react'
import { useAuth } from './auth.provider.jsx';

const UserContext = React.createContext({})

const UserProvider = props => (
    <UserContext.Provider value={useAuth().data} {...props} />
)

const useUser = () => React.useContext(UserContext);
export {UserProvider, useUser}