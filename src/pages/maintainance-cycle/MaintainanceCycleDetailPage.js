import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import Footer from "../../components/layout/footer/Footer";
import SparePartTable from "../../components/tables/SparePartTable";
import {
  getMaintainanceCycleDetail,
  createMaintainanceCycle,
  updateMaintainanceCycle,
} from "../../services/maintainance-cycle-service";
import { getCarTypesByManufacturerId, getManufacturers } from "../../services/car-service";

const defaultValues = {
  TemplateId: "",
  CarTypeId: "",
  ManufaturerId: "",
  YearOfManufactureFrom: "",
  YearOfManufactureTo: "",
  Note: "",
  TemplateDetails: [],
};

const MaintainanceCycleDetailPage = () => {
  const navigate = useNavigate();
  const [existedSpareParts, setExistedSpareParts] = useState([]);
  const [carTypes, setCarTypes] = useState();
  const [manufacturers, setManufacturers] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState();

  const formRef = useRef();
  const params = useParams();
  const selectedMaintainanceCycleId = params?.id;

  //get carTypes
  useEffect(() => {
    if(!selectedManufacturerId){
      return;
    }
    
    getCarTypesByManufacturerId(selectedManufacturerId).then((response) => {
      setCarTypes(response.data.Result);
    });
  }, [selectedManufacturerId]);

  //get Manufacturers
  useEffect(() => {
    getManufacturers().then((response) => {
      setManufacturers(response.data.Result);
    });
  }, []);

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm({ defaultValues });

  useEffect(() => {
    if (selectedMaintainanceCycleId) {
      getMaintainanceCycleDetail(selectedMaintainanceCycleId).then(
        (response) => {
          const maintainanceCycle = response.data.Result;
          //Convert year to date to display on the calendars
          maintainanceCycle.YearOfManufactureFrom = new Date(
            `1/1/${maintainanceCycle.YearOfManufactureFrom}`
          );
          maintainanceCycle.YearOfManufactureTo = new Date(
            `1/1/${maintainanceCycle.YearOfManufactureTo}`
          );
          setExistedSpareParts(maintainanceCycle.TemplateDetails);
          reset(maintainanceCycle);
        }
      );
    }
  }, [reset, selectedMaintainanceCycleId]);

  const functionButtons = [
    {
      label: "Lưu",
      icon: "pi pi-check",
      disabled: !isDirty || isSubmitting,
      className: "p-button-success",
      action: async () => {
        const isFormValid = await trigger();
        if (isFormValid) {
          formRef.current.requestSubmit();
        }
      },
    },
  ];

  const onHandleSparePartsChange = (templateDetails) => {
    setValue("TemplateDetails", templateDetails, { shouldDirty: true });
  };

  const onSubmit = (formData, e) => {
    setIsSubmitting(true);
    e.nativeEvent.preventDefault();

    //get year only
    formData.YearOfManufactureFrom =
      formData.YearOfManufactureFrom.getFullYear();
    formData.YearOfManufactureTo = formData.YearOfManufactureTo.getFullYear();

    if (formData.TemplateId) {
      updateMaintainanceCycle(formData).finally(() => setIsSubmitting(false));
    } else {
      createMaintainanceCycle(formData)
        .then((res) => {
          const templateId = res.data.Result;
          navigate(`/app/maintainance-cycle-detail/${templateId}`);
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const validateFromDateToDate = (
    value,
    compareField,
    isFromDate,
    fieldLabel
  ) => {
    const compareDate = getValues()[compareField];
    if (!value && !compareDate) {
      return true;
    }

    if (!value && compareDate) {
      return `${fieldLabel} không thể để trống`;
    }

    if (isFromDate && value > compareDate) {
      return `${fieldLabel} từ không thể lớn hơn ${fieldLabel} đến!`;
    }

    if (!isFromDate && value < compareDate) {
      return `${fieldLabel} đến không thể nhỏ hơn ${fieldLabel} từ!`;
    }
  };

  return (
    <div className="relative h-full pb-8">
      <ToggleablePanel header="Thông tin xe" className="pb-2" toggleable>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="formgrid grid"
        >
          <div className="field col-12 md:col-4">
            <label htmlFor="ManufaturerId">
              Hãng xe <b className="p-error">*</b>
            </label>
            <Controller
              name="ManufaturerId"
              control={control}
              rules={{ required: "Hãng xe không được để trống!" }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setSelectedManufacturerId(e.value);
                  }}
                  optionLabel="ManufacturerName"
                  optionValue="ManufacturerId"
                  options={manufacturers}
                  placeholder="Chọn hãng xe"
                  filter
                  filterBy="ManufacturerName"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("ManufaturerId")}
          </div>

          <div className="field col-12 md:col-4">
            <label htmlFor="CarTypeId">
              Dòng xe <b className="p-error">*</b>
            </label>
            <Controller
              name="CarTypeId"
              control={control}
              rules={{ required: "Dòng xe không được để trống!" }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="TypeName"
                  optionValue="TypeId"
                  options={carTypes}
                  placeholder="Chọn dòng xe"
                  filter
                  filterBy="TypeName"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("CarTypeId")}
          </div>

          <div className="field col-12 md:col-4">
            <label htmlFor="Note">Ghi Chú</label>
            <Controller
              name="Note"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  rows={1}
                  cols={30}
                  id={field.name}
                  {...field}
                  className="block w-full"
                />
              )}
            />
          </div>

          <div className="field col-12 md:col-4">
            <label htmlFor="YearOfManufactureFrom">
              Năm sản xuất từ <b className="p-error">*</b>
            </label>
            <Controller
              name="YearOfManufactureFrom"
              control={control}
              rules={{
                required: "Năm sản xuất từ không được để trống!",
                validate: {
                  isDateValid: (value) =>
                    validateFromDateToDate(
                      value,
                      "YearOfManufactureTo",
                      true,
                      "Năm sản xuất"
                    ),
                },
              }}
              render={({ field, fieldState }) => (
                <Calendar
                  id={field.name}
                  {...field}
                  view="year"
                  dateFormat="yy"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("YearOfManufactureFrom")}
          </div>

          <div className="field col-12 md:col-4">
            <label htmlFor="YearOfManufactureTo">
              Năm sản xuất đến <b className="p-error">*</b>
            </label>
            <Controller
              name="YearOfManufactureTo"
              control={control}
              rules={{
                required: "Năm sản xuất đến không được để trống!",
                validate: {
                  isDateValid: (value) =>
                    validateFromDateToDate(
                      value,
                      "YearOfManufactureFrom",
                      false,
                      "Năm sản xuất"
                    ),
                },
              }}
              render={({ field, fieldState }) => (
                <Calendar
                  id={field.name}
                  {...field}
                  view="year"
                  dateFormat="yy"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("YearOfManufactureTo")}
          </div>
        </form>
      </ToggleablePanel>
      <ToggleablePanel header="Phụ tùng" className="pb-2" toggleable>
        <SparePartTable
          existedSpareParts={existedSpareParts}
          handleSparePartsChange={onHandleSparePartsChange}
          advancePayment={0}
        />
      </ToggleablePanel>
      <Footer items={functionButtons} />
    </div>
  );
};

export default MaintainanceCycleDetailPage;
