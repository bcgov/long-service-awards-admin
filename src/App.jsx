/*!
 * LSA.Admin.Providers.User
 * File: user.provider.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { Outlet } from "react-router-dom";
import { useStatus } from "@/providers/status.provider.jsx";
import MenuBar from "@/components/common/MenuBar.jsx";
import { BlockUI } from "primereact/blockui";
import { useLocation } from "react-router-dom";
import dotenv from "dotenv";

/**
 * Global Router provider.
 *
 * @public
 */

export default function App() {
  const { loading } = useStatus();
  const location = useLocation();
  const nodeENV = process.env.NODE_ENV;

  // Check if the URL contains the dev site url
  const currentUrl = window.location.href;
  const isDevSite =
    currentUrl.includes("https://engagement.gww.gov.bc.ca/lsa/admin") ||
    currentUrl.includes("localhost");

  return (
    // Do not display header on RSVP registration
    <>
      {/* {!location.pathname.includes("/rsvp/") && ( */}
      <header>
        <BlockUI blocked={loading}>
          <MenuBar />
        </BlockUI>
      </header>
      {/* )} */}
      <main>
        <div className={"fluid m-2"}>
          {loading ? <p>Loading...</p> : <Outlet />}
        </div>
      </main>
      {nodeENV === "development" || isDevSite ? (
        <div className="w-screen bg-orange-500 fixed top-0 z-9999 m-0 text-center">
          Test Environment
        </div>
      ) : null}
    </>
  );
}
