import { Fragment, useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getRepairStatus, getRepairTypes } from "../../services/repair-service";
import { getCurrentDate, getExpiredDate } from "../../utils/Utils";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import CarAutoComplete from "../../components/auto-complete/CarAutoComplete";
import MaintainanceCycleAutoComplete from "../../components/auto-complete/MaintainanceCycleAutoComplete";
import SparePartTable from "../../components/tables/SparePartTable";

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
  PaymentMethod: "Tiền mặt",
  Diagnosis: "",
  CustomerNote: "",
  InternalNote: "",
  OrderDetails: [],
};

const RepairFormDetailPage = () => {
  const formRef = useRef();
  const [repairStatus, setRepairStatus] = useState(null);
  const [repairTypes, setRepairTypes] = useState(null);
  const [selectedCar, setSelectedCar] = useState({});
  const [sparePartFromTemplate, setSparePartFromTemplate] = useState([]);

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

  const onMaintainanceCycleSelect = (maintainanceCycle) => {
    const sparePartList = maintainanceCycle.TemplateDetails;
    setSparePartFromTemplate(sparePartList);
    setValue('OrderDetails', sparePartList);
  }

  const onHandleSparePartsChange = () => {}

  const onSubmit = () => {};

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
                      updateNextODO(e.value);
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
                    options={["Km", "Miles"]}
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

            <div className="field col-12 md:col-4">
              <label htmlFor="ODONext">Số ODO lần bảo dưỡng kế tiếp</label>
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

            <div className="field col-12 md:col-4">
              <label htmlFor="PaymentMethod">
                Hình thanh toán <b className="p-error">*</b>
              </label>
              <Controller
                name="PaymentMethod"
                control={control}
                rules={{ required: "Hình thanh toán không được để trống!" }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={["Tiền mặt", "Chuyển khoản"]}
                    placeholder="Chọn Hình thanh toán"
                    onSelect={(e) => updateNextODO(e.value)}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("PaymentMethod")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="IsInvoice">Xuất hóa đơn GTGT </label>
              <Controller
                name="IsInvoice"
                control={control}
                render={({ field }) => (
                  <div className="w-full py-2">
                    <Checkbox
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                    />
                  </div>
                )}
              />
            </div>

            <div className="field col-12 md:col-4"></div>
            <div className="field col-12 md:col-4">
              <label htmlFor="Diagnosis">
                Chuẩn đoán/tình trạng khi vào xưởng <b className="p-error">*</b>
              </label>
              <Controller
                name="Diagnosis"
                control={control}
                rules={{ required: "Chuẩn đoán không được để trống!" }}
                render={({ field, fieldState }) => (
                  <InputTextarea
                    id={field.name}
                    {...field}
                    rows={5}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("Diagnosis")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="CustomerNote">Ghi chú khách hàng</label>
              <Controller
                name="CustomerNote"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    id={field.name}
                    {...field}
                    rows={5}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="InternalNote">Ghi chú nội bộ</label>
              <Controller
                name="InternalNote"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    id={field.name}
                    rows={5}
                    {...field}
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
        </ToggleablePanel>
        <ToggleablePanel header="Thông tin xe và khách hàng" className="pb-2" toggleable>
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
                  <CarAutoComplete field={field} fieldState={fieldState} setValue={setValue} onSelectCar={setSelectedCar}/>
                )}
              />
              {getFormErrorMessage("LicensePlate")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="MaintainCycle">Chu kỳ bảo dưỡng</label>
                  <MaintainanceCycleAutoComplete id="MaintainCycle" onSelect={onMaintainanceCycleSelect}/>
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="ManufacturerName">Hãng xe</label>
              <InputText
                id="ManufacturerName"
                value={selectedCar.ManufacturerName || ""}
                disabled
                className="w-full"
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="TypeName">Dòng xe</label>
              <InputText
                id="TypeName"
                value={selectedCar.TypeName || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="YearOfManufacture">Năm sản xuất</label>
              <InputText
                id="YearOfManufacture"
                value={selectedCar.YearOfManufacture || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="VIN">VIN</label>
              <InputText
                id="VIN"
                value={selectedCar.VIN || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="PhoneNumber">Số điện thoại</label>
              <InputText
                id="PhoneNumber"
                value={selectedCar.Customer?.PhoneNumber || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="FullName">Khách hàng</label>
              <InputText
                id="FullName"
                value={selectedCar.Customer?.FullName || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="Email">Email</label>
              <InputText
                id="Email"
                value={selectedCar.Customer?.Email || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="Address">Địa chỉ</label>
              <InputText
                id="Address"
                value={selectedCar.Customer?.Address || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="CustomerTypeName">Loại khách hàng</label>
              <InputText
                id="CustomerTypeName"
                value={selectedCar.Customer?.TypeName || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="CustomerTaxCode">Mã số thuế</label>
              <InputText
                id="CustomerTaxCode"
                value={selectedCar.Customer?.TaxCode || ""}
                disabled
                className="w-full"
              />
            </div>
          </div>
        </ToggleablePanel>
        <ToggleablePanel header="Chi phí phụ tùng sửa chữa" className="pb-2" toggleable>
           <SparePartTable existedSpareParts={sparePartFromTemplate} handleSparePartsChange={onHandleSparePartsChange}/>
        </ToggleablePanel>
      </form>
    </Fragment>
  );
};

export default RepairFormDetailPage;
