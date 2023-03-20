/*!
 * LSA.Admin.Components.RecipientsSort
 * File: RecipientsSort.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import {useState} from 'react';
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";

function RecipientsSort({data, confirm, cancel}) {

    const {sortField, sortOrder} = data || {};
    const [selectedSortField, setSelectedSortField] = useState(sortField);
    const [selectedSortOrder, setSelectedSortOrder] = useState(sortOrder);

    // define sortable columns
    const cols = [
        {
            value: 'status',
            label: 'Status'
        },
        {
            value: 'employee_number',
            label: 'Employee Number'
        },
        {
            value: 'updated_at',
            label: 'Updated Date'
        },
        {
            value: 'created_at',
            label: 'Created Date'
        }
    ];
    const orders = [
        {
            value: 1,
            label: 'Ascending (A-Z)'
        },
        {
            value: -1,
            label: 'Descending (Z-A)'
        },
    ];

    return <>
        <div className="flex align-items-center flex-column pt-6 px-3">
            <div className={'m-2'}>
                <label className={'mr-2'} htmlFor={'sortBy'}>Sort By</label>
                <Dropdown
                    id={'sortBy'}
                    value={selectedSortField || ''}
                    onChange={(e) => {setSelectedSortField(e.target.value)}}
                    aria-describedby={`sortBy-help`}
                    options={cols}
                    placeholder={`Select a field to sort by`}
                />
            </div>
            <div className={'m-2'}>
                <label className={'mr-2'} htmlFor={'sortOrder'}>Sort Order</label>
                <Dropdown
                    id={'sortOrder'}
                    value={selectedSortOrder || ''}
                    onChange={(e) => {setSelectedSortOrder(e.target.value)}}
                    aria-describedby={`sortBy-help`}
                    options={orders}
                    placeholder={`Select the sort order`}
                />
            </div>
        </div>
        <div className="text-center">
            <Button
                icon="pi pi-sort"
                label="Apply Sort"
                className="p-button-success m-2"
                autoFocus
                onClick={() => {confirm({sortField: selectedSortField, sortOrder: selectedSortOrder})}}
            />
            <Button
                icon="pi pi-times"
                label="Cancel"
                className="p-button-text m-2"
                onClick={cancel}
            />
        </div>
    </>
}

export default RecipientsSort;