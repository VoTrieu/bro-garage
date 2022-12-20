import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
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
import { getCarTypes, getManufacturers } from "../../services/car-service";

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
  const [existedSpareParts, setExistedSpareParts] = useState([]);
  const [carTypes, setCarTypes] = useState();
  const [manufacturers, setManufacturers] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef();
  const params = useParams();
  const selectedMaintainanceCycleId = params?.id;

  const [formValue, setFormValue] = useState(defaultValues);

  //get carTypes
  useEffect(() => {
    getCarTypes().then((response) => {
      setCarTypes(response.data.Result);
    });
  }, []);

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
          setFormValue(maintainanceCycle);
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
    setFormValue((values) => ({ ...values, TemplateDetails: templateDetails }));
  };

  const onSubmit = (formData, e) => {
    setIsSubmitting(true);
    e.nativeEvent.preventDefault();
    const submitData = {
      ...formData,
      TemplateDetails: formValue.TemplateDetails,
    };

    //get year only
    submitData.YearOfManufactureFrom =
      submitData.YearOfManufactureFrom.getFullYear();
    submitData.YearOfManufactureTo =
      submitData.YearOfManufactureTo.getFullYear();

    if (formValue.TemplateId) {
      updateMaintainanceCycle(submitData).finally(() => setIsSubmitting(false));
    } else {
      createMaintainanceCycle(submitData)
        .then((res) => {
          const id = res.data.Result;
          setValue("TemplateId", id);
        })
        .finally(() => setIsSubmitting(false));
    }
    setFormValue(submitData);
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  return (
    <div className="relative h-full pb-8">
      <ToggleablePanel header="Thông tin xe" className="pb-2" toggleable>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="formgrid grid"
        >
          <div className="field col-12 md:col-6">
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

          <div className="field col-12 md:col-6">
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
                  onChange={(e) => field.onChange(e.value)}
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

          <div className="field col-12 md:col-6">
            <label htmlFor="YearOfManufactureFrom">
              Năm sản xuất từ <b className="p-error">*</b>
            </label>
            <Controller
              name="YearOfManufactureFrom"
              control={control}
              rules={{ required: "Năm sản xuất từ không được để trống!" }}
              render={({ field }) => (
                <Calendar
                  id={field.name}
                  {...field}
                  view="year"
                  dateFormat="yy"
                  className="w-full"
                />
              )}
            />
            {getFormErrorMessage("YearOfManufactureFrom")}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="YearOfManufactureTo">
              Năm sản xuất đến <b className="p-error">*</b>
            </label>
            <Controller
              name="YearOfManufactureTo"
              control={control}
              rules={{ required: "Năm sản xuất đến không được để trống!" }}
              render={({ field }) => (
                <Calendar
                  id={field.name}
                  {...field}
                  view="year"
                  dateFormat="yy"
                  className="w-full"
                />
              )}
            />
            {getFormErrorMessage("YearOfManufactureTo")}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="Note">Ghi Chú</label>
            <Controller
              name="Note"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  rows={5}
                  cols={30}
                  id={field.name}
                  {...field}
                  className="block w-full"
                />
              )}
            />
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
