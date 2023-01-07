import { Fragment, useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { useForm, Controller } from "react-hook-form";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getCarTypes, getManufacturers } from "../../services/car-service";
import { trim, forEach, isNumber } from "lodash";

let emptyCar = {
  CarTypeId: "",
  ManufacturerId: "",
  LicensePlate: "",
  YearOfManufacture: "",
  VIN: "",
};

const CarTable = (props) => {
  const formRef = useRef();
  const { handleCarsChange } = props;
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({ emptyCar });
  const [cars, setCars] = useState(props.cars || []);
  const [selectedCar, setSelectedCar] = useState(emptyCar);
  const [isShowDeleteCarDialog, setIsShowDeleteCarDialog] = useState(false);
  const [isShowCarDetailDialog, setIsShowCarDetailDialog] = useState(false);
  const [carTypes, setCarTypes] = useState();
  const [manufacturers, setManufacturers] = useState();
  const existedCars = props.existedCars;

  useEffect(() => {
    handleCarsChange(cars);
  }, [cars]);

  useEffect(() => {
    setCars(existedCars);
  }, [existedCars]);

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

  const hideDeleteCarDialog = () => {
    setIsShowDeleteCarDialog(false);
  };

  const hideCarDetailDialog = () => {
    setIsShowCarDetailDialog(false);
  };

  const showDeleteCarDialog = (car) => {
    setSelectedCar({ ...car });
    setIsShowDeleteCarDialog(true);
  };

  const onEditCard = (car) => {
    setSelectedCar(car);
    reset(car);
    setIsShowCarDetailDialog(true);
  };

  const deleteCar = () => {
    const newCarList = cars.filter(
      (car) => car.LicensePlate !== selectedCar.LicensePlate
    );
    setCars(newCarList);
    setSelectedCar(emptyCar);
    setIsShowDeleteCarDialog(false);
  };

  const onSubmit = (data) => {
    const newCar = forEach(
      data,
      (value, key) => (data[key] = !isNumber(value) ? trim(value, '. ') : value)
    );
    const _cars = [...cars];
    const index = _cars.findIndex((car) => {
      if (newCar.CarId) {
        return newCar.CarId === car.CarId;
      }
      return car.LicensePlate === selectedCar?.LicensePlate;
    });
    if (index > -1) {
      _cars[index] = newCar;
      setCars(_cars);
    } else {
      //add new car
      setCars((currentCars) => [...currentCars, newCar]);
    }
    setIsShowCarDetailDialog(false);
  };

  const openNew = () => {
    reset(emptyCar);
    setSelectedCar(emptyCar);
    setIsShowCarDetailDialog(true);
  };

  const header = (
    <div className="table-header flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openNew}
        />
      </span>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => onEditCard(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => showDeleteCarDialog(rowData)}
        />
      </Fragment>
    );
  };

  const deleteCarDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCarDialog}
      />
      <Button
        label="Xoá"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteCar}
      />
    </Fragment>
  );

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const carDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideCarDetailDialog}
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => formRef.current.requestSubmit()}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <DataTable
        value={cars}
        dataKey="CarId"
        header={header}
        responsiveLayout="stack"
        breakpoint="960px"
      >
        <Column field="LicensePlate" header="Biển số xe" sortable></Column>
        <Column field="ManufacturerName" header="Hãng xe" sortable></Column>
        <Column field="TypeName" header="Dòng xe" sortable></Column>
        <Column
          field="YearOfManufacture"
          header="Năm sản xuất"
          sortable
        ></Column>
        <Column field="VIN" header="VIN" sortable></Column>
        <Column body={actionBodyTemplate} exportable={false}></Column>
      </DataTable>

      <Dialog
        visible={isShowDeleteCarDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteCarDialogFooter}
        onHide={hideDeleteCarDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedCar && (
            <span>
              Bạn muốn xoá xe có biển số <b>{selectedCar.LicensePlate}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={isShowCarDetailDialog}
        style={{ width: "450px" }}
        header="Thông tin xe"
        modal
        className="p-fluid"
        footer={carDialogFooter}
        onHide={hideCarDetailDialog}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid"
        >
          <div className="field">
            <label htmlFor="ManufacturerId">
              Hãng xe <b className="p-error">*</b>
            </label>
            <Controller
              name="ManufacturerId"
              control={control}
              rules={{ required: "Hãng xe không được để trống." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                    const selectedManufacturer = manufacturers.find(
                      (item) => item.ManufacturerId === e.value
                    );
                    setValue(
                      "ManufacturerName",
                      selectedManufacturer.ManufacturerName
                    );
                  }}
                  autoFocus
                  optionValue="ManufacturerId"
                  optionLabel="ManufacturerName"
                  options={manufacturers}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  placeholder="Chọn hãng xe"
                />
              )}
            />
            {getFormErrorMessage("ManufacturerId")}
          </div>

          <div className="field">
            <label htmlFor="CarTypeId">
              Dòng xe <b className="p-error">*</b>
            </label>
            <Controller
              name="CarTypeId"
              control={control}
              rules={{ required: "Dòng xe không được để trống." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                    const selectedCarType = carTypes.find(
                      (item) => item.TypeId === e.value
                    );
                    setValue("TypeName", selectedCarType.TypeName);
                  }}
                  optionValue="TypeId"
                  optionLabel="TypeName"
                  options={carTypes}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  placeholder="Chọn dòng xe"
                />
              )}
            />
            {getFormErrorMessage("CarTypeId")}
          </div>

          <div className="field">
            <label htmlFor="LicensePlate">
              Biển số xe <b className="p-error">*</b>
            </label>
            <Controller
              name="LicensePlate"
              control={control}
              rules={{
                required: "Biển số xe không được để trống.",
                validate: {
                  isLicensePlateExist: (value) => {
                    if (selectedCar.LicensePlate) {
                      //if user is edit car, don't check license plate
                      return true;
                    }
                    const index = cars.findIndex(
                      (item) => item.LicensePlate === value
                    );
                    if (index > -1) {
                      return "Biển số xe đã tồn tại.";
                    }
                    return true;
                  },
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("LicensePlate")}
          </div>

          <div className="field">
            <label htmlFor="txtYearOfManufacture">
              Năm sản xuất <b className="p-error">*</b>
            </label>
            <Controller
              name="YearOfManufacture"
              control={control}
              rules={{ required: "Năm sản xuất không được để trống." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("YearOfManufacture")}
          </div>

          <div className="field">
            <label htmlFor="VIN">
              VIN <b className="p-error">*</b>
            </label>
            <Controller
              name="VIN"
              control={control}
              rules={{ required: "VIN không không được để trống." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("VIN")}
          </div>
        </form>
      </Dialog>
    </Fragment>
  );
};
export default CarTable;
