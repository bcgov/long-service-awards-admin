/*!
 * Default Edit Record
 * File: DataEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useStatus } from "@/providers/status.provider.jsx";
import FormContext from "@/components/common/FormContext";

/**
 * Default edit form component for record data
 */

export default function DataEdit({
  loader,
  save,
  remove,
  cancel = () => { },
  defaults,
  children,
  buttonText,
  header,
}) {
  const status = useStatus();

  // create new record
  const _handleDelete = async (id) => {
    try {
      const [error, result] = await remove(id);
      if (error) status.setMessage("deleteError");
      else status.setMessage("delete");
      if (!error && result) return result;
    } catch (error) {
      status.clear();
      status.setMessage("deleteError");
    }
  };

  // save record form data
  const _handleSave = async (data) => {
    try {
      status.setMessage("save");
      const [error, result] = await save(data);
      if (error && result) status.setMessage(result);
      else if (error && !result) status.setMessage("saveError");
      else status.setMessage("saveSuccess");
      if (!error && result) return result;
    } catch (error) {
      console.log(
        "[ERROR] DataEdit.jsx->_handleSave save parameter threw error and may need error message within it!"
      );
      //status.setMessage("saveError");
    }
  };

  // loader item record data
  const _loader = async () => {
    const { result } = (await loader()) || {};
    return result;
  };

  const _handleCancel = async () => {

    // LSA-525 Passing _cancel function in order to close the edit popup
    cancel();
  };

  return (
    <FormContext
      defaults={defaults}
      loader={_loader}
      save={_handleSave}
      cancel={_handleCancel}
      remove={remove ? _handleDelete : null}
      buttonText={buttonText}
      header={header}
    >
      {children}
    </FormContext>
  );
}
