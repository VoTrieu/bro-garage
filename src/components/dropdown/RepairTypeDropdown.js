import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { getRepairTypes } from "../../services/repair-service";

const RepairTypeDropdown = (props) => {
  const [repairTypes, setRepairTypes] = useState(null);

  useEffect(() => {
    getRepairTypes().then((res) => {
      const status = res.data.Result;
      setRepairTypes(status);
    });
  }, []);

  return (
    <Dropdown
      id={props.field?.name}
      {...props.field}
      options={repairTypes}
      optionLabel="TypeName"
      optionValue="TypeId"
      placeholder="Chọn loại phiếu"
      className={classNames("w-full", {
        "p-invalid": props.fieldState?.error,
      })}
    />
  );
};

export default RepairTypeDropdown;
