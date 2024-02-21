/*!
 * PECSF Award Options fieldset component
 * File: PecsfInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Controller, useFormContext } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";
import { RadioButton } from "primereact/radiobutton";
import { useAPI } from "@/providers/api.provider.jsx";
import { InputText } from "primereact/inputtext";

/**
 * Pecsf Award Options Component.
 * @returns pecsf award and options
 */

export default function PecsfInput({ control, setValue }) {
  // get values from registration form
  const { getValues } = useFormContext();
  const api = useAPI();

  // initialize PECSF local states
  const [pool, setPool] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingFullList, setLoadingFullList] = useState(true);
  const [charities, setCharities] = useState([]);
  const [pooledCharities, setPooledCharities] = useState([]);
  const [generalCharities, setGeneralCharities] = useState([]);
  const [selectedCharity1, setSelectedCharity1] = useState("");
  const [selectedCharity2, setSelectedCharity2] = useState("");

  /**
   * Initialize PECSF selections from form data
   * */

  useEffect(() => {
    const currentAward = getValues("service.awards");
    const { selections, award } = currentAward || {};
    const { id } = award || {};
    // filter selections by current award selection
    const pooledCharities = charities.filter((charity) => {
      return charity.pooled === true;
    });
    const isCharityPooled = (array, value) => {
      return array.some((obj) => obj.id === value);
    };
    return (selections || [])
      .filter(({ award_option }) => award_option.award === id)
      .forEach(({ award_option, pecsf_charity, custom_value }) => {
        const { name, value, type } = award_option || {};
        // if charities are selected, update states and PECSF form data
        if (pecsf_charity) {
          // determine PECSF donation type
          setValue("donation", "charities");
          const { id } = pecsf_charity || {};
          if (isCharityPooled(pooledCharities, id)) {
            setPool(true);
          } else {
            setPool(false);
          }
          // set selected charities
          if (name === "pecsf-charity-1") {
            setSelectedCharity1(pecsf_charity);
          } else {
            setSelectedCharity2(pecsf_charity);
          }

          // set charity to selected option ID value
          setValue(name, id);
        } else if (type === "pecsf-charity-local") {
          if (custom_value !== "custom") {
            setValue(name, custom_value);
          } else {
            setValue(name, "");
          }
        }
      });
  }, [charities]);

  /**
   * Quick sorting helper function for alphabetizing the charities listings
   * */
  function quickSort(charities) {
    if (charities.length <= 1) {
      return charities;
    }

    const pivot = charities[Math.floor(charities.length / 2)];
    const left = [];
    const right = [];

    for (let i = 0; i < charities.length; i++) {
      if (i === Math.floor(charities.length / 2)) continue; // skip the pivot
      if (charities[i].label < pivot.label) {
        left.push(charities[i]);
      } else {
        right.push(charities[i]);
      }
    }

    return quickSort(left).concat([pivot], quickSort(right));
  }

  /**
   * Load PECSF options (charities)
   * */

  useEffect(() => {
    // load PECSF charities
    const fetchCharities = async () => {
      try {
        const active = await api.getActivePECSFCharities();

        // Filter and sort the active to only include active charities
        const activeCharities = quickSort(active);

        const generalCharities = activeCharities.filter((charity) => {
          return charity.pooled === false;
        });
        // Update state of general charity lists
        setCharities(activeCharities);
        setGeneralCharities(generalCharities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFullList(false);
      }
    };

    api
      .getPooledPecsfCharities()
      .then((data) => {
        const pooledCharities = quickSort(
          data.filter((charity) => {
            return charity.active === true;
          })
        );
        setPooledCharities(pooledCharities);
        setCharities(pooledCharities);
        // setLoading(false);
      })
      .then(setLoading(false))
      .then(fetchCharities())
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /**
   * Reset PECSF options
   * */

  const resetOptions = () => {
    setValue("pecsf-charity-local-1", "");
    setValue("pecsf-charity-1", "");
    setValue("pecsf-charity-local-2", "");
    setValue("pecsf-charity-2", "");
    setSelectedCharity1("");
    setSelectedCharity2("");
  };

  // component for blocked form while charities are loading
  const blockTemplate = () => {
    return (
      <Button
        disabled={true}
        icon={"pi pi-spin pi-spinner"}
        label={"Loading PECSF Charities"}
      />
    );
  };

  return (
    <>
      <BlockUI
        blocked={loading || (loadingFullList && pool === false)}
        template={blockTemplate}
      >
        <h4>PECSF Donation Options</h4>
        <div className="m-1 flex align-items-center">
          <RadioButton
            onChange={() => {
              setPool(true);
              resetOptions();
            }}
            inputId="pool"
            value="pool"
            checked={pool}
          />
          <label htmlFor={"pool"} className="m-2">
            Donate to a PECSF Regional Pool Fund
          </label>
        </div>
        <div className="m-1 flex align-items-center">
          <RadioButton
            onChange={() => {
              setPool(false);
              resetOptions();
            }}
            inputId="charities"
            value="charities"
            checked={!pool}
          />
          <label htmlFor="charities" className="m-2">
            Donate to a registered charitable organization (maximum of two)
          </label>
        </div>

        {pool ? (
          <h4>Select the Regional Pool Fund </h4>
        ) : (
          <h4>Select the PECSF Charities</h4>
        )}

        <div className={"container"}>
          <div className={"grid"}>
            <div className={"col-12 form-field-container"}>
              <label htmlFor={"pecsf-charity-1"}>PECSF Charity 1</label>
              <Controller
                name={"pecsf-charity-1"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <Dropdown
                      id={field.name}
                      inputId={field.name}
                      value={field.value || ""}
                      filter
                      virtualScrollerOptions={{ itemSize: 38 }}
                      onChange={(e) => {
                        setSelectedCharity1(e.target.value);
                        setValue("pecsf-charity-local-1", "");
                        field.onChange(e.target.value);
                      }}
                      aria-describedby={`pecsf-charity-1-options-help`}
                      options={pool ? pooledCharities : generalCharities}
                      optionValue={"id"}
                      optionLabel={(option) =>
                        pool
                          ? `${option.label}`
                          : `${option.label} - ${option.vendor}`
                      }
                      className={classNames("w-full md:w-26rem", {
                        "p-invalid": error,
                      })}
                      placeholder={
                        pool
                          ? "Select a regional fund pool."
                          : "Select a charity"
                      }
                    />
                    {invalid && (
                      <p className="error">Please select a charity</p>
                    )}
                  </>
                )}
              />
              {!pool ? (
                <>
                  <label htmlFor={"pecsf-charity-local-1"}>
                    PECSF Charity 1: Specific local program or initiative
                    (optional).
                  </label>
                  <Controller
                    name={"pecsf-charity-local-1"}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <>
                        <InputText
                          disabled={!selectedCharity1 || pool}
                          maxLength={256}
                          id={field.name}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          aria-describedby={`award-option-help`}
                          className={classNames({ "p-invalid": error })}
                          placeholder={
                            pool
                              ? "Specific local program selection is not available for regional pool funds"
                              : selectedCharity1
                              ? `Specific local program or initiative.`
                              : "Please Select a charity."
                          }
                        />
                        {invalid && <p className="error">{error.message}</p>}
                      </>
                    )}
                  />
                </>
              ) : null}
            </div>
            {!pool ? (
              <div className={"col-12 form-field-container"}>
                <label htmlFor={"pecsf-charity-2"}>PECSF Charity 2</label>
                <Controller
                  name={"pecsf-charity-2"}
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <>
                      <Dropdown
                        disabled={pool}
                        id={field.name}
                        inputId={field.name}
                        value={field.value || ""}
                        filter
                        virtualScrollerOptions={{ itemSize: 38 }}
                        onChange={(e) => {
                          setSelectedCharity2(e.target.value);
                          setValue("pecsf-charity-local-2", "");
                          field.onChange(e.target.value);
                        }}
                        aria-describedby={`pecsf-charity-2-options-help`}
                        options={generalCharities}
                        optionLabel={(option) =>
                          pool
                            ? `${option.label}`
                            : `${option.label} - ${option.vendor}`
                        }
                        optionValue={"id"}
                        className={classNames("w-full md:w-26rem", {
                          "p-invalid": error,
                        })}
                        placeholder={
                          pool
                            ? "You can only select one regional pool fund."
                            : "Select a charity"
                        }
                      />
                      {invalid && (
                        <p className="error">Please select a charity</p>
                      )}
                    </>
                  )}
                />
                <label htmlFor={"pecsf-charity-local-2"}>
                  PECSF Charity 2: Specific local program or initiative
                  (optional).
                </label>
                <Controller
                  name={"pecsf-charity-local-2"}
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <>
                      <InputText
                        disabled={!selectedCharity2 || pool}
                        maxLength={256}
                        id={field.name}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        aria-describedby={`award-option-help`}
                        className={classNames({ "p-invalid": error })}
                        placeholder={
                          pool
                            ? "Specific local program selection is not available for regional pool funds"
                            : selectedCharity2
                            ? `Specific local program or initiative.`
                            : "Please Select a charity."
                        }
                      />
                      {invalid && <p className="error">{error.message}</p>}
                    </>
                  )}
                />
              </div>
            ) : null}
          </div>
        </div>
      </BlockUI>
    </>
  );
}
