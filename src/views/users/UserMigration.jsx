/*!
 * Recipient migration dialog
 * File: UserMigration.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import React, { useEffect, useState } from "react";
import { useAPI } from "@/providers/api.provider.jsx";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { useStatus } from "@/providers/status.provider.jsx";


/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function UserMigration( {userId, setShowDialog, title} ) {
  
    const api = useAPI();
    const status = useStatus();
    const [users, setUsers] = useState([]);
    const [targetUser, setTargetUser] = useState(null);
    const [currentUser, setCurrentUser] = useState({first_name: "user"});
    const [migrateSuccess, setMigrateSuccess] = useState(false);
  
    useEffect( () => {

        api.getUsers().then(userList => { 
            
            setUsers(userList.filter(user => {

                if ( user.id === userId ) {
                    setCurrentUser(user);
                }

                return user.id !== userId &&
                    ["org-contact", "administrator", "super-administrator"].includes(user.role.name);
            }));
           
        });

    }, []);

    const migrate = async () => {

        const [error, result] = await api.migrateRecipients(userId, targetUser);

        if ( error ) {
            status.setMessage(result.message);
            setMigrateSuccess(false);
            
        } else {
            status.setMessage(result.message);
            setMigrateSuccess(true);
        }
       
    };

    const remove = async () => {

        const [error] = await api.removeUser(userId);

        if ( error ) {
            status.setMessage("deleteError");
            
        } else {
            status.setMessage("delete");
            setShowDialog(null);
        }
    };
    
    return (<>

        <div>
            {title || "Migrate recipients from one user to another."}

        </div>
        <div>
                
            <label className={"m-1"}>Select target user:</label>
            
            <Dropdown
                    disabled={users.length === 0}
                    className={"m-3"}
                    value={targetUser}
                    onChange={(e) => {
                        setTargetUser(e.target.value);
                    }}
                    aria-describedby={`migration-help`}
                    options={users || []}
                    optionLabel={e => {

                        return `${e.first_name} ${e.last_name} [${e.role.label}]`;
                    }}
                    optionValue="id"
                    placeholder={"Select user"}
                />
        </div> 
        <div>

            <Button
                icon="pi pi-pencil"
                label={"Migrate " +currentUser.first_name+ "'s recipients"}
                className="p-button-success m-2"
                disabled={targetUser === null || migrateSuccess === true}
                autoFocus
                onClick={() => {
                    migrate();
                }}
            />
            
            <Button
                icon="pi pi-times"
                label={"Remove " +currentUser.first_name}
                className="p-button-danger m-2"
                disabled={targetUser === null || migrateSuccess !== true }
                autoFocus
                onClick={() => {
                    remove();
                }}
            />
                
            
        </div>
       
    </>);
}
