/*!
 * RSVP Create fieldset component
 * File: RSVPCreate.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import PageHeader from "@/components/common/PageHeader.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import RSVPConfirmationInput from "@/views/rsvp/fieldsets/RSVPConfirmationInput";
import RSVPGuest from "@/views/rsvp/fieldsets/RSVPGuest";
import RSVPInviteeDetails from "@/views/rsvp/fieldsets/RSVPInviteeDetails";
import RSVPOptions from "@/views/rsvp/fieldsets/RSVPOptions";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RSVPAttendanceInput from "./fieldsets/RSVPAttendanceInput";
import RSVPForm from "./form/RSVPForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

function GuestDietaryList({ guestAccommodations }) {
  const api = useAPI();
  const [labels, setLabels] = useState({});
  // Fetch dietary labels on mount
  useEffect(() => {
    api.getRSVPAccommodations().then((accommodations) => {
      const labelMap = {};
      (accommodations || []).forEach((a) => {
        labelMap[a.name] = a.label;
      });
      setLabels(labelMap);
    });
  }, [api]);
  if (!guestAccommodations)
    return (
      <ul>
        <li>None</li>
      </ul>
    );
  const items = Object.entries(guestAccommodations)
    .filter(([k, v]) => k !== "accessibility" && v)
    .map(([k]) => labels[k] || k);
  return (
    <ul>
      {items.length > 0 ? (
        items.map((label) => <li key={label}>{label}</li>)
      ) : (
        <li>None</li>
      )}
    </ul>
  );
}

function RecipientDietaryList({ recipientAccommodations }) {
  const api = useAPI();
  const [labels, setLabels] = useState({});
  useEffect(() => {
    api.getRSVPAccommodations().then((accommodations) => {
      const labelMap = {};
      (accommodations || []).forEach((a) => {
        labelMap[a.name] = a.label;
      });
      setLabels(labelMap);
    });
  }, [api]);
  if (!recipientAccommodations)
    return (
      <ul>
        <li>None</li>
      </ul>
    );
  const items = Object.entries(recipientAccommodations)
    .filter(([k, v]) => k !== "accessibility" && v)
    .map(([k, v]) => {
      // If value is an object with a label, use it, else use fetched label or key
      if (v && typeof v === "object" && v.label) return v.label;
      return labels[k] || k;
    });
  return (
    <ul>
      {items.length > 0 ? (
        items.map((label) => <li key={label}>{label}</li>)
      ) : (
        <li>None</li>
      )}
    </ul>
  );
}

export default function RSVPCreate() {
  const status = useStatus();
  const api = useAPI();
  const { id, token } = useParams() || {};
  const [isBlocked, setIsBlocked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAttending, setIsAttending] = useState(
    JSON.parse(searchParams.get("accept"))
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // define fieldset validation checks
  const fieldsetValidators = {
    confirmation: (data) => {
      const { confirmed } = data || {};
      return !!confirmed;
    },
  };

  // Preview dialog handler
  const handlePreview = (data) => {
    setPreviewData(data);
    setShowPreview(true);
  };

  // Modified save handler to optionally bypass preview
  const _handleSave = async (data, skipPreview = false) => {
    if (!skipPreview) {
      handlePreview(data);
      return;
    }
    let sanitizedData = { ...data };
    let updatedStatusData = {};
    //if user confirmed attendance
    if (sanitizedData.attendance_confirmed) {
      //remove unchecked dietary options for recipient
      Object.keys(sanitizedData.accommodations).forEach((key) =>
        sanitizedData.accommodations[key] === undefined
          ? delete sanitizedData.accommodations[key]
          : {}
      );
      if (sanitizedData.guest_count) {
        //remove unchecked dietary options for guest
        Object.keys(sanitizedData.guest_accommodations).forEach((key) =>
          sanitizedData.guest_accommodations[key] === undefined
            ? delete sanitizedData.guest_accommodations[key]
            : {}
        );
      }

      //format ceremony date for email
      Object.assign(sanitizedData.ceremony, {
        ...sanitizedData.ceremony,
        datetime_formatted: `${format(
          new Date(
            sanitizedData.ceremony.datetime.toLocaleString("en-US", {
              timeZone: "America/Vancouver",
            })
          ),
          `EEEE, MMMM dd, yyyy`
        )}`,
        ceremony_time: `${format(
          new Date(
            sanitizedData.ceremony.datetime.toLocaleString("en-US", {
              timeZone: "America/Vancouver",
            })
          ),
          `p`
        )}`,
      });

      updatedStatusData = {
        ...sanitizedData,
        status: "attending",
      };
    } else {
      updatedStatusData = {
        ...sanitizedData,
        status: "declined",
      };
    }

    console.log("Save:", updatedStatusData);

    try {
      status.setMessage("save");

      const [error, result] = await api.saveRSVP(updatedStatusData, id, token);

      if (error) status.setMessage("saveError");
      else status.setMessage("saveSuccess");

      if (!error && result) {
        setIsBlocked(true);
        if (result.result.status === "declined") {
          setAttendanceConfirmed(false);
        } else {
          setAttendanceConfirmed(true);
        }
        return result;
      }
    } catch (error) {
      status.setMessage("saveError");
    }
  };

  // Handler for confirming RSVP from preview
  const handleConfirmRSVP = async () => {
    setShowPreview(false);
    await _handleSave(previewData, true);
  };

  // Handler for canceling preview
  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // set default attendee form values
  const defaults = {
    recipients: [],
    ceremony: "",
  };

  // loader for Attendees record data
  const _loader = async () => {
    const [error, result] = (await api.getRSVP(id, token)) || {};
    if (error) {
      setIsExpired(true);
      return;
    }

    Object.assign(result.recipient.contact, {
      full_name: `${result.recipient.contact.first_name} ${result.recipient.contact.last_name}`,
    });
    result.attendance_confirmed = isAttending;
    return result;
  };

  return (
    <>
      <PageHeader heading={"RSVP"} />
      {/* Preview Dialog */}
      <Dialog
        visible={showPreview}
        onHide={handleCancelPreview}
        showHeader={true}
        header="Review Your RSVP"
        position="center"
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
        footer={
          <div>
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={handleCancelPreview}
            />
            <Button
              label="RSVP"
              className={
                previewData && !previewData.attendance_confirmed
                  ? "p-button-info"
                  : "p-button-success"
              }
              onClick={handleConfirmRSVP}
            />
          </div>
        }
      >
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {/* Use app's background and readable formatting */}
          <div className="p-3" style={{ background: "var(--surface-ground)" }}>
            {previewData ? (
              <div>
                <h2>Attendance</h2>
                <p>
                  <strong>Status:</strong>{" "}
                  {previewData.attendance_confirmed
                    ? "Attending"
                    : "Not Attending"}
                </p>
                {/* Only show the rest if attending */}
                {previewData.attendance_confirmed && (
                  <>
                    <Divider />
                    <h2>Ceremony</h2>
                    <p>
                      <strong>Date:</strong>{" "}
                      {previewData.ceremony?.datetime_formatted
                        ? previewData.ceremony.datetime_formatted
                        : previewData.ceremony?.datetime
                        ? (() => {
                            try {
                              return format(
                                new Date(previewData.ceremony.datetime),
                                "EEEE, MMMM dd, yyyy"
                              );
                            } catch {
                              return previewData.ceremony.datetime;
                            }
                          })()
                        : ""}
                      <br />
                      <strong>Time:</strong>{" "}
                      {previewData.ceremony?.ceremony_time
                        ? previewData.ceremony.ceremony_time
                        : previewData.ceremony?.datetime
                        ? (() => {
                            try {
                              return format(
                                new Date(previewData.ceremony.datetime),
                                "p"
                              );
                            } catch {
                              return "";
                            }
                          })()
                        : ""}
                      <br />
                      <strong>Location:</strong>{" "}
                      {previewData.ceremony?.venue || ""}
                    </p>
                    <Divider />
                    <h2>Recipient</h2>
                    <p>
                      <strong>Accessibility Requirements:</strong>{" "}
                      {previewData.recipient_accommodations?.accessibility ===
                      true
                        ? "Yes"
                        : "No"}
                    </p>
                    <strong>Recipient Dietary Requirements</strong>
                    <RecipientDietaryList
                      recipientAccommodations={
                        previewData.recipient_accommodations
                      }
                    />
                    <Divider />
                    <h2>Guest</h2>
                    <p>
                      <strong>Bringing a guest:</strong>{" "}
                      {previewData.guest_count ? "Yes" : "No"}
                    </p>
                    {previewData.guest_count && (
                      <>
                        <p>
                          <strong>Guest Accessibility Requirements:</strong>{" "}
                          {previewData.guest_accommodations?.accessibility === true
                            ? "Yes"
                            : "No"}
                        </p>
                        <strong>Guest Dietary Requirements:</strong>
                        <GuestDietaryList
                          guestAccommodations={previewData.guest_accommodations}
                        />
                      </>
                    )}
                    <Divider />
                    <h2>Notice of Collection, Consent, and Authorization</h2>
                    <p>
                      <strong>Consent:</strong>{" "}
                      {previewData.confirmed ? "Yes" : "No"}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <span>No data to preview.</span>
            )}
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={isBlocked}
        onHide={() => {}}
        showHeader={false}
        position="center"
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <div>
          <div
            className="flex align-items-center justify-content-center"
            style={{ margin: "2rem 0" }}
          >
            <i
              className="pi pi-check"
              style={{
                color: "#9fdaa8",
                fontSize: "1.5rem",
                marginRight: "1rem",
              }}
            ></i>
            <h2>
              {attendanceConfirmed
                ? "Thank you for confirming your attendance!"
                : "Thank you for confirming you will not attend the Long Service Awards"}
            </h2>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={isExpired}
        onHide={() => {}}
        showHeader={false}
        position="center"
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <div>
          <div
            className="flex align-items-center justify-content-center"
            style={{ margin: "2rem 0" }}
          >
            <i
              className="pi pi-exclamation-triangle"
              style={{
                color: "#e97984",
                fontSize: "1.5rem",
                marginRight: "2rem",
              }}
            ></i>
            <div className="flex-column">
              <h2>Your invitation has expired. </h2>
              <p>
                Please contact the Long Service Awards team for assistance:{" "}
                <a href="mailto:longserviceawards@gov.bc.ca?subject=Expired RSVP">
                  longserviceawards@gov.bc.ca
                </a>
              </p>
            </div>
          </div>
        </div>
      </Dialog>
      <RSVPForm
        loader={_loader}
        save={_handleSave}
        validate={fieldsetValidators.confirmation}
        defaults={defaults}
      >
        <RSVPAttendanceInput setIsAttending={setIsAttending} />
        {isAttending && <RSVPInviteeDetails />}
        {isAttending && <RSVPOptions />}
        {isAttending && <RSVPGuest />}
        {isAttending && (
          <RSVPConfirmationInput validate={fieldsetValidators.confirmation} />
        )}
      </RSVPForm>
    </>
  );
}
