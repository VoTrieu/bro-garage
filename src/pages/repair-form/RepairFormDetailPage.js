import { Fragment, useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { getRepairStatus } from "../../services/repair-service";
import { getCars } from "../../services/car-service";
import { getCurrentDate } from "../../utils/Utils";
import axios from "axios";
import classes from "./RepairForm.module.scss";



const RepairFormDetailPage = () => {
  const formRef = useRef();
  const [repairStatus, setRepairStatus] = useState(null);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchText, setSearchText] = useState(null);

  const defaultValues = {
    CarId: null,
    StatusId: 1,
    OrderDate: getCurrentDate(),
    DateIn: getCurrentDate(),
    DateOutEstimated: "",
    ODOCurrent: null,
    ODONext: null,
    ExpiredInDate: "",
    IsInvoice: true,
    AdvancePayment: null,
    PaymentMethod: "",
    Diagnosis: "",
    CustomerNote: "",
    InternalNote: "",
    OrderDetails: [],
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  //get nesscessary data
  useEffect(() => {
    getStatus();
  }, []);

  //search car
  useEffect(() => {
    const source = axios.CancelToken.source();
    getCars(20, 1, searchText, source.token).then((res) => {
      const data = res?.data.Result.Data;
      setFilteredCars(data);
    });
    return () => {
      source.cancel();
    };
  }, [searchText]);

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const getStatus = () => {
    getRepairStatus().then((res) => {
      const status = res.data.Result;
      setRepairStatus(status);
    });
  };

  const onSearchCar = (event) => {
    let query = event.query.trim();
    if (query === searchText?.trim()) {
      return setFilteredCars([...filteredCars]);
    }
    setSearchText(query);
  };

  const onSubmit = () => {};

  const itemLicensePlateTemplate = (item) => {
    return (
      <div className="grid">
        <div className="col-3">{item.LicensePlate}</div>
        <div className="col-3 pl-4">{item.TypeName}</div>
        <div className="col-3 pl-4">{item.ManufacturerName}</div>
        <div className="col-3 pl-4">{item.CustomerName}</div>
      </div>
    );
  };

  return (
    <Fragment>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <ToggleablePanel header="Thông tin phiếu" className="pb-2" toggleable>
          <div className="formgrid grid">
            <div className="field col-12 md:col-4">
              <label htmlFor="Representative">Số phiếu</label>
              <Controller
                name="Representative"
                control={control}
                render={({ field }) => (
                  <InputText id={field.name} {...field} className="w-full" />
                )}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="OrderDate">Ngày lập phiếu</label>
              <Controller
                name="OrderDate"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="StatusName">Tình trạng phiếu</label>
              <Controller
                name="StatusName"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    rules={{ required: "Tình trạng không được để trống!" }}
                    options={repairStatus}
                    optionLabel="StatusName"
                    optionValue="StatusId"
                    placeholder="Chọn tình trạng"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="DateIn">Ngày vào</label>
              <Controller
                name="DateIn"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
            </div>
          </div>
        </ToggleablePanel>
        <ToggleablePanel header="Thông tin xe" className="pb-2" toggleable>
          <div className="formgrid grid">
            <div className="field col-12 md:col-4">
              <label htmlFor="LicensePlate">
                Biển số xe <b className="p-error">*</b>
              </label>
              <Controller
                name="LicensePlate"
                control={control}
                rules={{ required: "Biển số xe không được để trống!" }}
                render={({ field, fieldState }) => (
                  <AutoComplete
                    id={field.name}
                    {...field}
                    suggestions={filteredCars}
                    completeMethod={onSearchCar}
                    field="LicensePlate"
                    dropdown
                    forceSelection
                    itemTemplate={itemLicensePlateTemplate}
                    // onChange={(e) => onSparePartCodeChange(e.value)}
                    placeholder="Nhập từ khoá"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("LicensePlate")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="ManufacturerName">Hãng xe</label>
              <Controller
                name="ManufacturerName"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
                    className={classNames("block w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="TypeName">Dòng xe</label>
              <Controller
                name="TypeName"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
                    className={classNames("block w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="LicensePlate">Chu kỳ bảo dưỡng</label>
              <Controller
                name="LicensePlate"
                control={control}
                render={({ field, fieldState }) => (
                  <AutoComplete
                    id={field.name}
                    {...field}
                    // value={selectedSparePart.ProductCode}
                    // suggestions={filteredSparePart}
                    // completeMethod={onSearchSparePart}
                    field="LicensePlate"
                    dropdown
                    forceSelection
                    // itemTemplate={itemLicensePlateTemplate}
                    // onChange={(e) => onSparePartCodeChange(e.value)}
                    // onSelect={(e) => onSparePartCodeSelect(e.value)}
                    placeholder="Nhập từ khoá"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("LicensePlate")}
            </div>
          </div>
        </ToggleablePanel>
      </form>
    </Fragment>
  );
};

export default RepairFormDetailPage;
