import { Fragment, useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { getRepairStatus, getRepairTypes } from "../../services/repair-service";
import { getCars } from "../../services/car-service";
import { getCurrentDate, getExpiredDate } from "../../utils/Utils";
import { Calendar } from "primereact/calendar";
import { isNumber } from "lodash";
import axios from "axios";
import classes from "./RepairForm.module.scss";

const RepairFormDetailPage = () => {
  const formRef = useRef();
  const [repairStatus, setRepairStatus] = useState(null);
  const [repairTypes, setRepairTypes] = useState(null);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchText, setSearchText] = useState(null);

  const defaultValues = {
    CarId: null,
    StatusId: 1,
    OrderCode: "",
    OrderDate: getCurrentDate(),
    DateIn: getCurrentDate(),
    DateOutEstimated: "",
    ODOCurrent: 0,
    ODONext: 5000,
    ODOUnit: "Km",
    ExpiredInDate: getExpiredDate(15),
    IsInvoice: true,
    AdvancePayment: 0,
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
    setValue,
    getValues,
    reset,
  } = useForm({ defaultValues });

  //get nesscessary data
  useEffect(() => {
    getStatus();
    getTypes();
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

  const getTypes = () => {
    getRepairTypes().then((res) => {
      const types = res.data.Result;
      setRepairTypes(types);
    });
  };

  const updateNextODO = (value) => {
    if (value === null) {
      setValue("ODONext", 0);
      return;
    }
    const unit = getValues("ODOUnit");
    const currentODO = getValues("ODOCurrent");
    if (unit === "Km") {
      setValue("ODONext", currentODO + 5000);
    } else {
      setValue("ODONext", currentODO + 3100);
    }
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
              <label htmlFor="OrderCode">Số phiếu</label>
              <Controller
                name="OrderCode"
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
              <label htmlFor="StatusName">
                Tình trạng phiếu <b className="p-error">*</b>
              </label>
              <Controller
                name="StatusName"
                control={control}
                rules={{ required: "Tình trạng không được để trống!" }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
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
              {getFormErrorMessage("StatusName")}
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="TypeName">
                Loại phiếu <b className="p-error">*</b>
              </label>
              <Controller
                name="TypeName"
                control={control}
                rules={{ required: "Loại phiếu không được để trống!" }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={repairTypes}
                    optionLabel="TypeName"
                    optionValue="TypeId"
                    placeholder="Chọn loại phiếu"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("TypeName")}
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="ODOCurrent">
                Số ODO hiện tại <b className="p-error">*</b>
              </label>

              <Controller
                name="ODOCurrent"
                control={control}
                rules={{
                  required: "Số ODO hiện tại không được để trống!",
                  min: 0,
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    id={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(e) => {
                      field.onChange(e);
                      updateNextODO(e.value)
                    }}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("ODOCurrent")}
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="ODOUnit">
                Đơn vị ODO <b className="p-error">*</b>
              </label>
              <Controller
                name="ODOUnit"
                control={control}
                rules={{ required: "Đơn vị ODO không được để trống!" }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    optionLabel="value"
                    optionValue="id"
                    options={[
                      { id: "Km", value: "Km" },
                      { id: "Miles", value: "Miles" },
                    ]}
                    placeholder="Chọn đơn vị ODO"
                    onSelect={(e) => updateNextODO(e.value)}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("ODOUnit")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="DateIn">
                Ngày vào <b className="p-error">*</b>
              </label>
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

            <div className="field col-12 md:col-4">
              <label htmlFor="ODONext">
                Số ODO lần bảo dưỡng kế tiếp <b className="p-error">*</b>
              </label>
              <Controller
                name="ODONext"
                control={control}
                render={({ field, fieldState }) => (
                  <InputNumber
                    id={field.name}
                    {...field}
                    mode="decimal"
                    disabled
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="DateOutEstimated">
                Ngày dự kiến giao xe <b className="p-error">*</b>
              </label>
              <Controller
                name="DateOutEstimated"
                control={control}
                rules={{
                  required: "Ngày dự kiến giao xe không được để trống!",
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    id={field.name}
                    {...field}
                    showIcon
                    dateFormat="yy/mm/dd"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("DateOutEstimated")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="ExpiredInDate">Thời hạn báo giá</label>
              <Controller
                name="ExpiredInDate"
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
              <label htmlFor="AdvancePayment">Tạm ứng</label>
              <Controller
                name="AdvancePayment"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    id={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(e) => field.onChange(e)}
                    mode="currency"
                    currency="VND"
                    currencyDisplay="code"
                    locale="vi-VN"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="DateOutActual">Ngày giao xe thực tế</label>
              <Controller
                name="DateOutActual"
                control={control}
                render={({ field, fieldState }) => (
                  <Calendar
                    id={field.name}
                    {...field}
                    showIcon
                    dateFormat="yy/mm/dd"
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
