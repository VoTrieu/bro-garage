import { Fragment, useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useReactToPrint } from "react-to-print";
import { classNames } from "primereact/utils";
import {
  createRepairForm,
  getRepairFormDetail,
  updateRepairForm,
} from "../../services/repair-service";
import {
  getCurrentDate,
  getExpiredDate,
  getDateWithFormat,
} from "../../utils/Utils";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import Footer from "../../components/layout/footer/Footer";
import CarAutoComplete from "../../components/auto-complete/CarAutoComplete";
import MaintainanceCycleAutoComplete from "../../components/auto-complete/MaintainanceCycleAutoComplete";
import StatusDropdown from "../../components/dropdown/StatusDropdown";
import RepairTypeDropdown from "../../components/dropdown/RepairTypeDropdown";
import SparePartTable from "../../components/tables/SparePartTable";
import RepairFormPdf from "../repair-form/RepairFormPdf";

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
  PaymentMethod: "CASH",
  Diagnosis: "",
  CustomerNote: "",
  InternalNote: "",
  Car: {
    LicensePlate: "",
  },
  OrderDetails: null,
};

const RepairFormDetailPage = () => {
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm({ defaultValues });

  const formRef = useRef();
  const printComponentRef = useRef();
  const [selectedCar, setSelectedCar] = useState({});
  const [sparePartFromTemplate, setSparePartFromTemplate] = useState([]);
  const [advancePayment, setAdvancePayment] = useState(0);
  const [isCountTax, setIsCountTax] = useState(getValues('IsInvoice'));
  const [discountPercent, setDiscountPercent] = useState();
  const [printData, setPrintData] = useState(null);
  const [isProcessing, setIsProcessing] = useState({
    printing: false,
    saving: false,
  });
  const params = useParams();
  const [selectedRepairFormId, setSelectedRepairFormId] = useState(params?.id);

  //get repairForm Detail
  useEffect(() => {
    if (selectedRepairFormId) {
      getRepairFormDetail(selectedRepairFormId).then((response) => {
        const data = response.data.Result;
        setSparePartFromTemplate(data.OrderDetails);
        setSelectedCar(data.Car);

        //convert date to IsoDateTime
        data.DateOutEstimated = new Date(data.DateOutEstimated);
        if (data.DateOutActual) {
          data.DateOutActual = new Date(data.DateOutActual);
        }
        reset(data);
      });
    }
  }, [reset, selectedRepairFormId]);

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
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
    const existedSpareParts = getValues("OrderDetails");
    const updatedSparePartList = [...existedSpareParts, ...sparePartList];
    setSparePartFromTemplate(updatedSparePartList);
    setValue("TemplateId", maintainanceCycle.TemplateId);
  };

  const onHandleSparePartsChange = (spareParts) => {
    setValue("OrderDetails", spareParts, { shouldDirty: true });
  };

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const functionButtons = [
    {
      label: "In Pdf",
      icon: "pi pi-print",
      className: "p-button-success",
      disabled: !selectedRepairFormId || isProcessing.printing,
      action: async () => {
        setIsProcessing({ ...isProcessing, printing: true });
        const res = await getRepairFormDetail(selectedRepairFormId);
        const data = res.data.Result;
        setPrintData(data);
        //wait for printData updated
        setTimeout(() => {
          handlePrint();
          setIsProcessing({ ...isProcessing, printing: false });
        }, 100);
      },
    },
    {
      label: "Lưu",
      icon: "pi pi-check",
      className: "p-button-success",
      disabled: !isDirty || isProcessing.saving,
      action: async () => {
        const isFormValid = await trigger();
        if (isFormValid) {
          setIsProcessing({ ...isProcessing, saving: true });
          formRef.current.requestSubmit();
        }
      },
    },
  ];

  const onSubmit = (formValue) => {
    const { LicensePlate, DateOutEstimated, DateOutActual, ...data } =
      formValue;
    data.DateOutEstimated = getDateWithFormat(DateOutEstimated);
    if (DateOutActual) {
      data.DateOutActual = getDateWithFormat(DateOutActual);
    }
    if (data.OrderId) {
      updateRepairForm(data).finally(() => {
        setIsProcessing({ ...isProcessing, saving: false });
      });
      return;
    }
    createRepairForm(data)
      .then((res) => {
        const orderId = res.data.Result;
        setSelectedRepairFormId(orderId);
        setValue("OrderId", orderId);
      })
      .finally(() => {
        setIsProcessing({ ...isProcessing, saving: false });
      });
  };

  return (
    <Fragment>
      <div className="relative h-full pb-8">
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
                <label htmlFor="StatusId">
                  Tình trạng phiếu <b className="p-error">*</b>
                </label>
                <Controller
                  name="StatusId"
                  control={control}
                  rules={{ required: "Tình trạng không được để trống!" }}
                  render={({ field, fieldState }) => (
                    <StatusDropdown field={field} fieldState={fieldState}/>
                  )}
                />
                {getFormErrorMessage("StatusName")}
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="TypeId">
                  Loại phiếu <b className="p-error">*</b>
                </label>
                <Controller
                  name="TypeId"
                  control={control}
                  rules={{ required: "Loại phiếu không được để trống!" }}
                  render={({ field, fieldState }) => (
                    <RepairTypeDropdown field={field} fieldState={fieldState}/>
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
                      dateFormat="dd/mm/yy"
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
                      onValueChange={(e) => {
                        field.onChange(e);
                        setAdvancePayment(e.value);
                      }}
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
                <label htmlFor="Discount">Chiết khấu</label>
                <Controller
                  name="Discount"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      id={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onValueChange={(e) => {
                        field.onChange(e);
                        setDiscountPercent(e.value);
                      }}
                      suffix=" %"
                      mode="decimal" min={0} max={100}
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
                      dateFormat="dd/mm/yy"
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
                      optionLabel="label"
                      optionValue="id"
                      options={[
                        { id: "CASH", label: "Tiền mặt" },
                        { id: "TRANSFER", label: "Chuyển khoản" },
                      ]}
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
                        onChange={(e) => {
                          field.onChange(e.checked);
                          setIsCountTax(e.checked);
                        }}
                        checked={field.value}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="field col-12 md:col-4">
                <label htmlFor="Diagnosis">
                  Chuẩn đoán/tình trạng khi vào xưởng{" "}
                  <b className="p-error">*</b>
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
          <ToggleablePanel
            header="Thông tin xe và khách hàng"
            className="pb-2"
            toggleable
          >
            <div className="formgrid grid">
              <div className="field col-12 md:col-4">
                <label htmlFor="LicensePlate">
                  Biển số xe <b className="p-error">*</b>
                </label>
                <Controller
                  name="Car.LicensePlate"
                  control={control}
                  rules={{ required: "Biển số xe không được để trống!" }}
                  render={({ field, fieldState }) => (
                    <CarAutoComplete
                      field={field}
                      fieldState={fieldState}
                      setValue={setValue}
                      onSelectCar={setSelectedCar}
                    />
                  )}
                />
                {getFormErrorMessage("LicensePlate")}
              </div>

              <div className="field col-12 md:col-4">
                <label htmlFor="MaintainCycle">Chu kỳ bảo dưỡng</label>
                <MaintainanceCycleAutoComplete
                  id="MaintainCycle"
                  onSelect={onMaintainanceCycleSelect}
                />
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
        </form>
        <ToggleablePanel
          header="Chi phí phụ tùng sửa chữa"
          className="pb-2 mb-8"
          toggleable
        >
          <SparePartTable
            existedSpareParts={sparePartFromTemplate}
            handleSparePartsChange={onHandleSparePartsChange}
            advancePayment={advancePayment}
            discountPercent={discountPercent}
            isRepairForm={true}
            isCountTax={isCountTax}
          />
        </ToggleablePanel>
        <Footer items={functionButtons} />
      </div>
      <div style={{ display: "none" }}>
        <RepairFormPdf ref={printComponentRef} data={printData} />
      </div>
    </Fragment>
  );
};

export default RepairFormDetailPage;
