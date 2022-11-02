import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import ToggleablePanel from "../../components/panels/ToogleablePanel";
import CarTable from "../../components/car-table/CarTable";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { sendCustomerData } from "../../store/customer-actions";
import Footer from "../../components/layout/footer/Footer";

const CustomerDetailPage = () => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const functionButtons = [
    {
      label: "Lưu",
      icon: "pi pi-check",
      className: "p-button-success",
      action: () => {
        formRef.current.requestSubmit();
      },
    },
  ];

  const customerTypes = [
    {
      label: "Cá nhân",
      value: 0,
    },
    {
      label: "Doanh nghiệp",
      value: 1,
    },
  ];
  // const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
  const defaultValues = {
    Email: "",
    FullName: "",
    PhoneNumber: "",
    Remark: "",
    Representative: "",
    TaxCode: "",
    TypeId: 0,
  };
  const [formValue, setFormValue] = useState(defaultValues);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setFormValue((values) => ({ ...values, [name]: value }));
  // };

  const handleCarsChange = (cars) => {
    setFormValue((values) => ({ ...values, Cars: cars }));
  };

  const onSubmit = (formData, e) => {
    e.nativeEvent.preventDefault();
    setFormValue((values) => ({ ...values, ...formData }));
    dispatch(sendCustomerData(formValue));
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
            <label htmlFor="FullName">Tên Khách Hàng</label>
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
            <label htmlFor="TypeId">Loại Khách Hàng</label>
            <Controller
              name="TypeId"
              control={control}
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
            <label htmlFor="PhoneNumber">Số điện thoại</label>
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
            <label htmlFor="Representative">Người đại diện</label>
            <Controller
              name="Representative"
              control={control}
              rules={{ required: "Người đại diện không được để trống!" }}
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
            {getFormErrorMessage("Representative")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="TaxCode">Mã Số Thuế</label>
            <Controller
              name="TaxCode"
              control={control}
              rules={{ required: "Mã số thuế không được để trống!" }}
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
            {getFormErrorMessage("TaxCode")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="Email">Email</label>
            <Controller
              name="Email"
              control={control}
              rules={{
                required: "Email không được để trống!",
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
            <label htmlFor="Address">Địa Chỉ</label>
            <Controller
              name="Address"
              control={control}
              rules={{ required: "Địa chỉ không được để trống!" }}
              render={({ field, fieldState }) => (
                <InputTextarea
                  rows={5}
                  cols={30}
                  id={field.name}
                  {...field}
                  className={classNames("block w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("Address")}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="Remark">Ghi Chú</label>
            <Controller
              name="Remark"
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
        <CarTable handleCarsChange={handleCarsChange} />
      </ToggleablePanel>
      <Footer items={functionButtons} />
    </div>
  );
};

export default CustomerDetailPage;
