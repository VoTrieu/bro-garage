import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import CarTable from "../../components/tables/CarTable";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import Footer from "../../components/layout/footer/Footer";
import {
  getCustomerDetail,
  createNewCustomer,
  updateCustomer,
} from "../../services/customer-service";

const defaultValues = {
  CustomerId: "",
  Email: "",
  FullName: "",
  PhoneNumber: "",
  Remark: "",
  Representative: "",
  TaxCode: "",
  TypeId: 1,
};

const CustomerDetailPage = () => {
  const [existedCars, setExistedCars] = useState([]);
  const formRef = useRef();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedCustomerId = params?.id;

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    if (selectedCustomerId) {
      getCustomerDetail(selectedCustomerId).then((response) => {
        const customer = response.data.Result;
        setExistedCars(customer.Cars);
        reset(customer);
      });
    }
  }, [reset, selectedCustomerId]);

  const functionButtons = [
    {
      label: "Lưu",
      icon: "pi pi-check",
      disabled: !isDirty || isSubmitting,
      className: "p-button-success",
      action: () => {
        formRef.current.requestSubmit();
      },
    },
  ];

  const customerTypes = [
    {
      label: "Cá nhân",
      value: 1,
    },
    {
      label: "Doanh nghiệp",
      value: 2,
    },
  ];


  const handleCarsChange = (cars) => {
    setValue('Cars', cars);
  };

  const onSubmit = (formData, e) => {
    e.nativeEvent.preventDefault();
    if (formData.CustomerId) {
      updateCustomer(formData);
    } else {
      createNewCustomer(formData).then((res) => {
        const id = res.data.Result;
        setValue("CustomerId", id);
      })
      .finally(() => setIsSubmitting(false));;
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  return (
    <div className="relative h-full pb-8">
      <ToggleablePanel header="Khách Hàng" className="pb-2" toggleable>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="formgrid grid"
        >
          <div className="field col-12 md:col-6">
            <label htmlFor="FullName">
              Tên Khách Hàng <b className="p-error">*</b>
            </label>
            <Controller
              name="FullName"
              control={control}
              rules={{ required: "Tên khách hàng không được để trống!" }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames("block w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("FullName")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="TypeId">
              Loại Khách Hàng <b className="p-error">*</b>
            </label>
            <Controller
              name="TypeId"
              control={control}
              rules={{ required: "Loại khách hàng không được để trống!" }}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="label"
                  options={customerTypes}
                  className="w-full"
                  placeholder="Chọn Loại Khách Hàng"
                />
              )}
            />
            {getFormErrorMessage("TypeId")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="PhoneNumber">
              Số điện thoại <b className="p-error">*</b>
            </label>
            <Controller
              name="PhoneNumber"
              control={control}
              rules={{
                required: "Số điện thoại không được để trống!",
                pattern: {
                  value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                  message: "Số điện thoại không hợp lệ!",
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames("block w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("PhoneNumber")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="Representative">
              Người đại diện
            </label>
            <Controller
              name="Representative"
              control={control}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className="block w-full"
                />
              )}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="TaxCode">
              Mã Số Thuế
            </label>
            <Controller
              name="TaxCode"
              control={control}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className="block w-full"
                />
              )}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="Email">
              Email
            </label>
            <Controller
              name="Email"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Email không hợp lệ. E.g. example@email.com",
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames("block w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("Email")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="Address">
              Địa Chỉ
            </label>
            <Controller
              name="Address"
              control={control}
              render={({ field, fieldState }) => (
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
      <ToggleablePanel header="Xe" className="pb-2" toggleable>
        <CarTable
          existedCars={existedCars}
          handleCarsChange={handleCarsChange}
        />
      </ToggleablePanel>
      <Footer items={functionButtons} />
    </div>
  );
};

export default CustomerDetailPage;
