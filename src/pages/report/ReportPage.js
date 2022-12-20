import { Fragment, useState } from "react";
import { Fieldset } from "primereact/fieldset";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useForm, Controller } from "react-hook-form";
import CarAutoComplete from "../../components/auto-complete/CarAutoComplete";
import CustomerAutoComplete from "../../components/auto-complete/CustomerAutoComplete";
import StatusDropdown from "../../components/dropdown/StatusDropdown";
import AppDataTable from "../../components/tables/AppDataTable";
import classes from "../repair-form/RepairForm.module.scss";
import { getRepairForms, getRepairFormsExport } from "../../services/repair-service"
import { getDateWithFormat } from "../../utils/Utils"; 

const defaultValues = {
  customerId: null,
  carId: null,
  createdFromDate: undefined,
  createdToDate: undefined,
  statusId: null,
  typeId: null,
  dateInFrom: undefined,
  dateInTo: undefined,
  dateOutFrom: undefined,
  dateOutTo: undefined
};

const ReportPage = () => {
  const [repairForms, setRepairForms] = useState([]);
  const [paginatorOptions, setPaginatorOptions] = useState();

  const {
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    setValue,
    getValues,
    reset
  } = useForm({ defaultValues });

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
      return `${fieldLabel} đến không thể nhỏ hơn ${fieldLabel} từ!`
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={classNames(
          classes.status_badge,
          classes[`status_${rowData.StatusId}`]
        )}
      >
        {rowData.StatusName}
      </span>
    );
  };

  const columns = [
    {
      field: "Car.LicensePlate",
      header: "Biển số",
    },
    {
      field: "Car.ManufacturerName",
      header: "Hãng xe",
    },
    {
      field: "Car.TypeName",
      header: "Dòng xe",
    },
    {
      field: "Car.Customer.FullName",
      header: "Tên khách hàng",
    },
    {
      field: "StatusName",
      header: "Trạng thái",
      body: statusBodyTemplate,
    },
    {
      field: "OrderDate",
      header: "Ngày lập phiếu",
    },
  ];

  const exportReport = (keyword) => {
    const { FullName, LicensePlate, ...searchParameters} = getValues();
    return getRepairFormsExport(keyword, searchParameters);
  }

  const getData = (pageSize, pageIndex, keyword) => {
    const { FullName, LicensePlate, ...searchParameters} = getValues();
    getRepairForms(pageSize, pageIndex, keyword, searchParameters).then((response) => {
      const { Data, ...paginatorOptions } = response.data.Result;
      setPaginatorOptions(paginatorOptions);
      setRepairForms(Data);
    });
  };

  const onSubmit = (data) => {
    const { pageSize, pageIndex } = paginatorOptions;
    const { FullName, LicensePlate, ...searchParameters} = data;
    getRepairForms(pageSize, pageIndex, '', searchParameters).then((response) => {
      if(!response.data.IsSuccess){
        return;
      }
      const { Data, ...paginatorOptions } = response.data.Result;
      setPaginatorOptions(paginatorOptions);
      setRepairForms(Data);
    });
  };
  return (
    <Fragment>
      <Fieldset className="mb-4" legend="Thông tin tìm kiếm" toggleable>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formgrid grid">
            <div className="field col-12 md:col-4">
              <label htmlFor="LicensePlate">Biển số xe</label>
              <Controller
                name="LicensePlate"
                control={control}
                render={({ field, fieldState }) => (
                  <CarAutoComplete
                    field={field}
                    fieldState={fieldState}
                    setValue={setValue}
                  />
                )}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="FullName">Khách hàng</label>
              <Controller
                name="FullName"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomerAutoComplete
                    field={field}
                    fieldState={fieldState}
                    setValue={setValue}
                  />
                )}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="StatusId">Tình trạng phiếu</label>
              <Controller
                name="StatusId"
                control={control}
                render={({ field, fieldState }) => (
                  <StatusDropdown field={field} fieldState={fieldState} />
                )}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="createdFromDate">Ngày lập phiếu từ</label>
              <Controller
                name="createdFromDate"
                control={control}
                rules={{
                  validate: {
                    isDateValid: (value) =>
                      validateFromDateToDate(
                        value,
                        "createdToDate",
                        true,
                        "Ngày lập phiếu"
                      ),
                  },
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    value={field.value}
                    onChange={(date) => field.onChange(getDateWithFormat(date.value))}
                    showIcon
                    autoFocus
                    dateFormat="dd/mm/yy"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("createdFromDate")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="createdToDate">Ngày lập phiếu đến</label>
              <Controller
                name="createdToDate"
                control={control}
                rules={{
                  validate: {
                    isDateValue: (value) =>
                      validateFromDateToDate(
                        value,
                        "createdFromDate",
                        false,
                        "Ngày lập phiếu"
                      ),
                  },
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    value={field.value}
                    onChange={(date) => field.onChange(getDateWithFormat(date.value))}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("createdToDate")}
            </div>

            <div className="col-12 md:col-4"></div>

            <div className="field col-12 md:col-4">
              <label htmlFor="dateInFrom">Ngày vào từ</label>
              <Controller
                name="dateInFrom"
                control={control}
                rules={{
                  validate: {
                    isDateValue: (value) =>
                      validateFromDateToDate(
                        value,
                        "dateInTo",
                        true,
                        "Ngày vào"
                      )
                  },
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    value={field.value}
                    onChange={(date) => field.onChange(getDateWithFormat(date.value))}
                    showIcon
                    autoFocus
                    dateFormat="dd/mm/yy"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("dateInFrom")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="dateInTo">Ngày vào đến</label>
              <Controller
                name="dateInTo"
                control={control}
                rules={{
                  validate: {
                    isDateValue: (value) =>
                      validateFromDateToDate(
                        value,
                        "dateInFrom",
                        false,
                        "Ngày vào"
                      )
                  },
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    value={field.value}
                    onChange={(date) => field.onChange(getDateWithFormat(date.value))}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("dateInTo")}
            </div>

            <div className="col-12 md:col-4"></div>

            <div className="field col-12 md:col-4">
              <label htmlFor="dateOutFrom">Ngày ra từ</label>
              <Controller
                name="dateOutFrom"
                control={control}
                rules={{
                  validate: {
                    isDateValue: (value) =>
                      validateFromDateToDate(
                        value,
                        "dateOutTo",
                        true,
                        "Ngày ra"
                      )
                  },
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    value={field.value}
                    onChange={(date) => field.onChange(getDateWithFormat(date.value))}
                    showIcon
                    autoFocus
                    dateFormat="dd/mm/yy"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("dateOutFrom")}
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="dateOutTo">Ngày ra đến</label>
              <Controller
                name="dateOutTo"
                control={control}
                rules={{
                  validate: {
                    isDateValue: (value) =>
                      validateFromDateToDate(
                        value,
                        "dateOutFrom",
                        false,
                        "Ngày ra"
                      )
                  },
                }}
                render={({ field, fieldState }) => (
                  <Calendar
                    value={field.value}
                    onChange={(date) => field.onChange(getDateWithFormat(date.value))}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("dateOutTo")}
            </div>

          </div>

          <div className="text-right">
          <Button
              disabled={!isDirty}
              type="button"
              label="Xoá"
              icon="pi pi-refresh"
              className="mt-2 mr-4"
              onClick={() => reset(defaultValues)}
            />
            <Button
              disabled={!isValid || !isDirty}
              type="submit"
              label="Tìm kiếm"
              icon="pi pi-search"
              className="mt-2"
            />
          </div>
        </form>
      </Fieldset>

      <AppDataTable
        data={repairForms}
        columns={columns}
        dataKey="TemplateId"
        title="Phiếu bảo dưỡng / sửa chữa"
        isHideBodyActions={true}
        isHideCreateButton={true}
        excelExportable={true}
        excelFileName="Báo cáo"
        paginatorOptions={paginatorOptions}
        fnGetData={getData}
        fnGetAllDataForExport={exportReport}
      />
    </Fragment>
  );
};

export default ReportPage;
