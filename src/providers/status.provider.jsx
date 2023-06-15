/*!
 * LSA.Admin.Providers.Status
 * File: status.provider.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import * as React from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { BlockUI } from "primereact/blockui";
import schema from "@/services/settings.services.js";

const StatusContext = React.createContext({});

function StatusProvider(props) {
  // status states
  const [loading, setLoading] = React.useState(false);

  // Toast messaging DOM reference
  const toast = useRef(null);

  /**
     * Preset messages (configured for Toast library)
         - severity	    string	        null	Severity of the message.
         - summary	    element/string	null	Summary content of the message.
         - detail	    element/string	null	Detail content of the message.
         - content	    any	            null	Custom content of the message. If enabled, summary and details properties are ignored.
         - className	string	        null	Style class of the message.
         - closable	    boolean	        true	Whether the message can be closed manually using the close icon.
         - sticky	    element	        null	When enabled, message is not removed automatically.
         - life         number	        3000	Delay in milliseconds to close the message automatically.
     */

  /**
   * Post Toast message
   */

  const message = (message) => {
    const msgValue =
      typeof message === "string"
        ? schema.lookup("messages", message)
        : message;
    toast.current.replace(msgValue);
  };

  /**
   * Clear Toast messages
   */

  const clear = () => {
    toast.current.clear();
    toast.current.replace([]);
  };

  /**
   * Loading block panel
   */

  const setOverlay = (setValue) => {
    setLoading(setValue);
  };

  return (
    <>
      <Toast baseZIndex={999999} style={{ zIndex: 99999 }} ref={toast} />
      <BlockUI style={{ zIndex: 9999 }} blocked={loading} fullScreen>
        {loading && (
          <div className={"progress-spinner"}>
            <ProgressSpinner />
          </div>
        )}
      </BlockUI>
      <StatusContext.Provider
        value={{
          setMessage: message,
          clear,
          loading,
          setLoading: setOverlay,
        }}
        {...props}
      />
    </>
  );
}

const useStatus = () => React.useContext(StatusContext);
export { useStatus, StatusProvider };
