/*!
 * LSA.Admin.Components.PageHeader
 * File: PageHeader.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */


import {Card} from "primereact/card";

function PageHeader({heading, subheading}) {

    return <Card className={'mt-3 mb-3'} >
        <h1>{heading}</h1>
        <h2>{subheading}</h2>
    </Card>
}

export default PageHeader;