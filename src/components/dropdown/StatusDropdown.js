import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { getRepairStatus } from "../../services/repair-service";

const StatusDropdown = (props) => {
  const [repairStatus, setRepairStatus] = useState(null);

  useEffect(() => {
    getRepairStatus().then((res) => {
      const status = res.data.Result;
      setRepairStatus(status);
    });
  }, []);

  return (
    <Dropdown
      id={props.field?.name}
      {...props.field}
      options={repairStatus}
      optionLabel="StatusName"
      optionValue="StatusId"
      placeholder="Chọn tình trạng"
      className={classNames("w-full", {
        "p-invalid": props.fieldState?.error,
      })}
    />
  );
};

export default StatusDropdown;
