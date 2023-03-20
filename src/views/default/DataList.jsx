/*!
 * LSA.Admin.Components.RecipientList
 * File: RecipientList.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useState, useEffect, Fragment } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import {useStatus} from "@/providers/status.provider.jsx";
import EditToolBar from "@/views/default/EditToolBar.jsx";
import {Toolbar} from "primereact/toolbar";

export default function DataList({schema=[], create=null, remove, edit, view, options, loader}) {
    // set default filter values:
    const initFilters = {
        global: null,
        updated_at: null,
        created_at: null
    };

    const status = useStatus();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(initFilters);

    const loadData = () => {
        setLoading(true);

        loader().then(console.log)

        // load records into view
        loader().then(setItems)
            .catch(console.error)
            .finally(() => {
            setLoading(false)
        });
    };

    /**
     * Load data
     * */

    useEffect(loadData, []);

    const clearFilter = () => {
        setFilters(initFilters);
    };

    const showFilterDialog = () => {
        console.log('filter')
    };
    const applyFilter = (filterData) => {
        console.log('filter')
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    const dateFilterTemplate = (options) => {
        return <Calendar
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            mask="99/99/9999"
        />;
    };

    /**
     * View record data
     * - render data display view passed to component
     * */

    const onView = (data) => {
        return view(data);
    }

    /**
     * Edit record data
     * - render edit fieldset passed to component
     * */

    const onEdit = (data, callback) => {
        return edit(data, callback);
    }

    /**
     * Create new record
     * */

    const onCreate = async () => {
        try {
            status.setMessage('create');
            // create recipient record stub and redirect
            const [error, res] = await create();
            const {message} = res || {};
            if (error) status.setMessage('createError');
            else status.setMessage(message);
            // reload data
            loadData()
        } catch (error) {
            status.setMessage('createError');
        }
    }

    /**
     * Edit Options data
     * - render options fieldset passed to component
     * */

    const onOptions = (data, callback) => {
        return options ? options(data, callback) : null;
    }

    /**
     * Delete record
     * - delete record by ID
     * */

    const onDelete = async (data) => {
        try {
            const {id} = data || {};
            const [error, res] = await remove(id);
            const {message} = res || {};
            if (error) status.setMessage('deleteError');
            else {
                status.setMessage(message);
                // reload data
                loadData()
            }
        } catch (error) {
            status.setMessage('deleteError');
        }
    }

    /**
     * Select recipient for action
     * */

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelected(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = () => {};

    /**
     * Render data table header component
     * */

    const header = () => {
        return (
            <>
                <Toolbar
                    left={<Fragment>
                        { create && <Button
                            className={'m-1'}
                            type="button"
                            icon="pi pi-plus"
                            label={`Add New`}
                            onClick={onCreate}
                        /> }
                        <Button
                            className={'m-1'}
                            type="button"
                            icon="pi pi-sync"
                            label="Refresh"
                            onClick={loadData}
                        />
                    </Fragment>}
                    right={<Fragment>
                    <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        disabled={true}
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
                    </Fragment>
                }
                />
            </>
        );
    };

    /**
     * Render recipient data table
     * */

    console.log(items)

    return <>
        <DataTable
            value={items}
            dataKey={"id"}
            rowClassName="m-0 p-0"
            stripedRows
            loading={loading}
            selection={selected}
            onSelectionChange={onSelectionChange}
            selectAll={selectAll}
            onSelectAllChange={onSelectAllChange}
            tableStyle={{ minHeight: '70vh' }}
            header={header}
            scrollable
            scrollHeight="70vh"
        >
            <Column
                bodyStyle={{maxWidth: '3em'}}
                headerStyle={{maxWidth: '3em'}}
                selectionMode="multiple"
            />
            <Column
                className={'p-1'}
                bodyStyle={{overflow: "visible",  maxWidth: '12em'}}
                headerStyle={{overflow: "visible", maxWidth: '12em'}}
                body={(rowData) => {
                    return <EditToolBar
                        loader={loadData}
                        save={(callback) => onEdit(rowData, callback)}
                        view={() => onView(rowData)}
                        remove={() => onDelete(rowData)}
                        options={options ? () => onOptions(rowData) : null}
                    />}}
            />
            {
                schema.map((col, i) => {
                    return <Column
                        className={'p-1'}
                        sortField={col.name}
                        sortable={col.sortable}
                        key={`${col.name}-${i}`}
                        field={col.name}
                        header={col.label}
                        body={col.body}
                    />
                })
            }
        </DataTable>
    </>
}