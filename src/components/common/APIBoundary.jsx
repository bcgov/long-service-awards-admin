/*!
 * LSA.Admin.Components.APIBoundary
 * File: APIBoundary.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import {useRouteError} from "react-router-dom";
import {Card} from "primereact/card";
import {Panel} from "primereact/panel";

const APIBoundary =() => {
    let error = useRouteError();
    return (
        <>
            <Card className={'mb-3'}>
                <h1>LSA Application Error</h1>
                <h2>Please contact support for assistance</h2>
            </Card>
            <Panel header={'Details'}>
                <div className={'container'}>
                    <p>{error.message}</p>
                </div>
            </Panel>
        </>
    );
}

export default APIBoundary;