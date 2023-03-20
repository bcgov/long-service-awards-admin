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
import { Tag } from 'primereact/tag';
import {useStatus} from "@/providers/status.provider.jsx";
import {useAPI} from "@/providers/api.provider.jsx";
import EditToolBar from "@/views/default/EditToolBar.jsx";
import {Toolbar} from "primereact/toolbar";
import {Dialog} from "primereact/dialog";
import RecipientsSort from "@/views/recipients/RecipientsSort";
import RecipientsFilter from "@/views/recipients/RecipientsFilter.jsx";
import {useNavigate} from "react-router-dom";
import RecipientView from "@/views/recipients/RecipientView";

export default function RecipientList() {
    // set default filter values:
    // - shows confirmed registrations only
    // - 25-Year threshold for milestones (LSAs)
    const initFilters = {
        global: null,
        status: null,
        first_name: null,
        last_name: null,
        employee_number: null,
        organization: null,
        cycle: '2023',
        milestones: [25, 30, 35, 40, 45, 50],
        qualifying_year: null,
        ceremony: null,
        confirmed: null,
        updated_at: null,
        created_at: null
    };
    const api = useAPI();
    const status = useStatus();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(null);
    const [recipients, setRecipients] = useState([]);
    const [stats, setStats] = useState({
        total_count: 0,
        lsa_current_count: 0,
        lsa_previous_count: 0,
        service_pins_count: 0,
        other_count: 0
    });
    const [totalFilteredRecords, setTotalFilteredRecords] = useState(0);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(initFilters);
    const [pageState, setPageState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'id',
        sortOrder: 0,
        filters: {}
    });

    /**
     * Load recipients using applied filter
     * */

    useEffect(() => {
        loadData();
    }, [pageState, filters]);

    const loadData = () => {
        setLoading(true);
        const {first, rows, sortField, sortOrder} = pageState || {};
        // compose list filters
        const filter = {
            orderby: sortField,
            order: sortOrder >= 0 ? 'ASC' : 'DESC',
            limit: rows,
            offset: first || 0,
            ...filters
        };

        // get records stats
        api.getRecipientStats().then((stats) => setStats(stats || {
            total_count: 0,
            lsa_current_count: 0,
            lsa_previous_count: 0,
            service_pins_count: 0,
            other_count: 0
        })).catch(console.error);

        // apply filters to recipient data request
        api.getRecipients(filter)
            .then((results) => {
                const {total_filtered_records, recipients} = results || {};
                setRecipients(recipients)
                setTotalFilteredRecords(total_filtered_records);
                console.log(results)
            }).finally(() => {
            setLoading(false)
        });
    };

    // create new registration
    const createRecipient = async () => {
        try {
            status.setMessage('create');
            // create recipient record stub and redirect
            const [error, res] = await api.createRecipient();
            const {message, result} = res || {};
            if (error) status.setMessage('createError');
            else status.setMessage(message);
            if (!error && result) {
                const { id } = result;
                navigate(`/recipients/edit/${id}`);
            }
        } catch (error) {
            status.setMessage('createError');
        }
    }

    // utility to format dates as readable
    const formatDate = (value) => {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearFilter = () => {
        setFilters(initFilters);
    };

    const showFilterDialog = () => {
        setShowDialog('filter')
    };
    const applyFilter = (filterData) => {
        if (filterData) setFilters(filterData);
        setShowDialog(null);
    }

    const showSortDialog = () => {
        setShowDialog('sort')
    };
    const applySort = (sortData) => {
        if (sortData) setPageState({...pageState, ...sortData});
        setShowDialog(null);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    /**
     * Column templates
     * */

    const ceremonyTemplate = (rowData) => {
        const {service} = rowData || {};
        const {confirmed} = service || {};
        const statuses = {
            assigned: {
                label: 'Assigned',
                severity: 'primary'
            },
            declined: {
                label: 'Declined',
                severity: 'danger'
            },
            expired: {
                label: 'Expired',
                severity: 'danger'
            },
            invited: {
                label: 'Invited',
                severity: 'primary'
            },
            registered: {
                label: 'Registered',
                severity: 'info'
            },
            attending: {
                label: 'Attending',
                severity: 'success'
            },
            waitlisted: {
                label: 'Waitlisted',
                severity: 'warning'
            },
            default: {
                label: 'Draft',
                severity: 'warning'
            }
        }
        const status = confirmed
            ? statuses.registered
            : statuses.hasOwnProperty(rowData.status)
                ? statuses[rowData.status] : statuses.default;

        return <Tag value={status.label} severity={status.severity} />
    };

    const servicesTemplate = (rowData) => {
        const {services} = rowData || {};
        return <>
            {(services || []).map(({id, milestone, cycle, qualifying_year}) => {
                return <div key={id} className={'grid w-full m-0 p-0'}>
                    <div className={'col-4'}>{cycle}</div>
                    <div className={'col-4'}>{milestone}</div>
                    <div className={'col-4'}>{qualifying_year}</div>
                </div>
            })
            }</>;
    };

    const userTemplate = (rowData) => {
        const {user} = rowData || {};
        const { idir, first_name, last_name} = user || {};
        const statuses = {
            archive: {
                label: 'Archived',
                severity: 'info',
                description: 'Recipient was archived from a previous cycle.'
            },
            self: {
                label: 'Self',
                severity: 'primary',
                description: 'Recipient self-registered'
            },
            delegated: {
                label: 'Delegated',
                severity: 'warning',
                description: `Recipient was registered by ${idir} (${first_name + ' ' + last_name}).`
            },
            default: {
                label: 'Other',
                severity: 'secondary',
                description: 'Registration is in progress or incomplete.'
            }
        }
        const status = user ? statuses.delegated :
            statuses.hasOwnProperty(rowData.status) ? statuses[rowData.status] : statuses.default;
        return <Tag
            tooltip={status.description}
            value={status.label}
            severity={status.severity || 'info'}
        />;
    };

    const updatedDateTemplate = (rowData) => {
        return formatDate(rowData.updated_at);
    };

    const createdDateTemplate = (rowData) => {
        return formatDate(rowData.created_at);
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
     * Lazy loading
     * */

    const onPage = (event) => {
        setPageState(event);
    };

    /**
     * View recipient record
     * */

    const onView = (data) => {
        return <RecipientView data={data} />
    }

    /**
     * Delete recipient record
     * */

    const onDelete = (data) => {
        const {id} = data || {};
        api.removeRecipient(id).then(() => {
            status.setMessage('delete');
        }).catch((e) => {
            console.error(e);
            status.setMessage('deleteError');
        })
    }

    /**
     * Select recipient for action
     * */

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelected(value);
        setSelectAll(value.length === stats);
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
                        <Button
                            className={'m-1'}
                            type="button"
                            icon="pi pi-sort"
                            label="Sort"
                            onClick={showSortDialog}
                        />
                        <Button
                            className={'m-1'}
                            type="button"
                            icon="pi pi-filter"
                            label="Filter"
                            onClick={showFilterDialog}
                        />
                        <Button
                            className={'m-1'}
                            type="button"
                            icon="pi pi-filter-slash"
                            label="Clear"
                            onClick={clearFilter}
                        />
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
                    </Fragment>}
                />
            </>
        );
    };

    /**
     * Render recipient data table
     * */

    return <>
        <Dialog
            visible={showDialog === 'sort'}
            onHide={() => setShowDialog(null)}
            header={"Sort Recipients"}
            position="center"
            closable
            maximizable
            modal
            breakpoints={{ '960px': '80vw' }}
            style={{ width: '50vw' }}
        >
            <RecipientsSort
                data={pageState}
                confirm={applySort}
                cancel={() => setShowDialog(null)}
            />
        </Dialog>
        <Dialog
            visible={showDialog === 'filter'}
            onHide={() => setShowDialog(null)}
            header={"Filter Recipients"}
            position="center"
            closable
            maximizable
            modal
            breakpoints={{ '960px': '80vw' }}
            style={{ width: '50vw' }}
        >
            <RecipientsFilter
                data={filters || {}}
                confirm={applyFilter}
                cancel={() => setShowDialog(null)}
            />
        </Dialog>
        <DataTable
            value={recipients}
            lazy
            dataKey="id"
            paginator
            paginatorPosition={'top'}
            paginatorLeft={
                <DataTable className={'w-full text-xs'} value={[stats || {}]}>
                    <Column className={'pt-0 pb-0'} field="lsa_current_count" header="LSA"></Column>
                    <Column className={'pt-0 pb-0'} field="service_pins_count" header="Pins"></Column>
                    <Column className={'pt-0 pb-0'} field="lsa_previous_count" header="Archived"></Column>
                    <Column className={'pt-0 pb-0'} field="other_count" header="Other"></Column>
                    <Column className={'pt-0 pb-0'} field="total_count" header="Total"></Column>
                    <Column className={'pt-0 pb-0'} field="filtered" header="Filtered" body={<>{totalFilteredRecords}</>}></Column>
                </DataTable>
            }
            paginatorRight={<Button
                className={'m-1'}
                type="button"
                icon="pi pi-user-plus"
                label="Register"
                onClick={createRecipient}
            />}
            rowClassName="m-0 p-0"
            stripedRows
            rows={pageState.rows}
            rowsPerPageOptions={[10, 25, 50]}
            totalRecords={totalFilteredRecords}
            onPage={onPage}
            first={pageState.first}
            sortField={pageState.sortField}
            sortOrder={pageState.sortOrder}
            loading={loading}
            selection={selected}
            onSelectionChange={onSelectionChange}
            selectAll={selectAll}
            onSelectAllChange={onSelectAllChange}
            tableStyle={{ minWidth: '75rem', minHeight: '70vh' }}
            header={header}
            scrollable
            scrollHeight="60vh"
        >
            <Column
                selectionMode="multiple"
            />
            <Column
                className={'p-1'}
                bodyStyle={{overflow: "visible",  maxWidth: '12em'}}
                headerStyle={{overflow: "visible", maxWidth: '12em'}}
                body={(rowData) => {
                    return <EditToolBar
                        item={rowData}
                        save={`/recipients/edit/${rowData.id}`}
                        view={() => onView(rowData)}
                        remove={() => onDelete(rowData)}
                    />}}
            />
            <Column
                className={'p-1'}
                header="First Name"
                field="contact.first_name"
                headerStyle={{ minWidth: '10em' }}
                bodyStyle={{ minWidth: '10em' }}

            />
            <Column
                className={'p-1'}
                header="Last Name"
                field="contact.last_name"
                headerStyle={{ minWidth: '10em' }}
                bodyStyle={{ minWidth: '10em' }}

            />
            <Column
                className={'p-1'}
                header="Empl. No."
                field="employee_number"
                headerStyle={{ minWidth: '7em' }}
                bodyStyle={{ minWidth: '7em' }}

            />
            <Column
                className={'p-1'}
                header="Org"
                field="organization.abbreviation"
                headerStyle={{ minWidth: '8em' }}
                bodyStyle={{ minWidth: '8em' }}

            />
            <Column
                className={'p-1'}
                header={
                    <div style={{minWidth: '16em'}} className="flex justify-content-between p-0">
                        <div>Cycle</div><div>Milestone</div><div>Qualifying</div>
                    </div>
                }
                field="services"
                body={servicesTemplate}
                headerStyle={{ minWidth: '19em' }}
                bodyStyle={{ minWidth: '19em' }}

            />
            <Column
                className={'p-1'}
                header="Status"
                field="service.ceremony_opt_out"
                headerStyle={{ minWidth: '8em' }}
                bodyStyle={{ minWidth: '8em' }}
                body={ceremonyTemplate}
            />

            <Column
                className={'p-1'}
                header="Reg"
                field="user"
                headerStyle={{ minWidth: '5em' }}
                bodyStyle={{ minWidth: '5em' }}
                body={userTemplate}
            />
            <Column
                className={'p-1'}
                field="updated_at"
                header="Updated"
                body={updatedDateTemplate}
                headerStyle={{ minWidth: '7em' }}
                bodyStyle={{ minWidth: '7em' }}

            />
            <Column
                className={'p-1'}
                field="created_at"
                header="Created"
                body={createdDateTemplate}
                headerStyle={{ minWidth: '7em' }}
                bodyStyle={{ minWidth: '7em' }}

            />
        </DataTable>
    </>
}