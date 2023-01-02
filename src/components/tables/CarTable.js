import { Fragment, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getCarTypes, getManufacturers } from "../../services/car-service";
import { trim } from "lodash";

let emptyCar = {
  CarTypeId: "",
  ManufacturerId: "",
  LicensePlate: "",
  YearOfManufacture: "",
  VIN: "",
};

const CarTable = (props) => {
  const { handleCarsChange } = props;
  const [cars, setCars] = useState(props.cars || []);
  const [selectedCar, setSelectedCar] = useState(emptyCar);
  const [updatedCar, setUpdatedCar] = useState();
  const [isShowDeleteCarDialog, setIsShowDeleteCarDialog] = useState(false);
  const [isShowCarDetailDialog, setIsShowCarDetailDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    setUpdatedCar(car);
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

  const updateCarTypeAndManufactureName = (_selectedCar) => {
    const selectedCarType = carTypes.find(
      (car) => car.TypeId === _selectedCar.CarTypeId
    );
    _selectedCar.CarTypeName = selectedCarType.TypeName;

    const selectedManufacturer = manufacturers.find(
      (manufacturer) =>
        manufacturer.ManufacturerId === _selectedCar.ManufacturerId
    );
    _selectedCar.ManufactureName = selectedManufacturer.ManufacturerName;
    return _selectedCar;
  }

  const saveCar = () => {
    setSubmitted(true);
    for (const key in selectedCar) {
      if (!trim(selectedCar[key])) {
        return;
      }
    }
    //update existed car
    const _cars = [...cars];
    const index = _cars.findIndex(
      (car) => car.LicensePlate === updatedCar?.LicensePlate
    );
    if (_cars[index]) {
      const carWithName = updateCarTypeAndManufactureName(selectedCar);
      _cars[index] = { ...carWithName };
      setCars(_cars);
    } else {
      //add new car
      const carWithName = updateCarTypeAndManufactureName(selectedCar);
      setCars((currentCars) => [...currentCars, carWithName]);
    }
    setIsShowCarDetailDialog(false);
  };

  const onInputChange = (e, field) => {
    const val = (e.target && e.target.value) || "";
    let _selectedCar = { ...selectedCar };
    _selectedCar[field] = val;
    setSelectedCar(_selectedCar);
  };

  const openNew = () => {
    setSelectedCar(emptyCar);
    setSubmitted(false);
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
        onClick={saveCar}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <DataTable
        value={cars}
        dataKey="CarTypeId"
        header={header}
        responsiveLayout="stack"
        breakpoint="960px"
      >
        <Column field="LicensePlate" header="Biển số xe" sortable></Column>
        <Column field="ManufactureName" header="Hãng xe" sortable></Column>
        <Column field="CarTypeName" header="Dòng xe" sortable></Column>
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
        <div className="field">
          <label htmlFor="txtManufacturerId">
            Hãng xe <b className="p-error">*</b>
          </label>
          <Dropdown
            id="txtManufacturerId"
            value={selectedCar.ManufacturerId}
            optionValue="ManufacturerId"
            onChange={(e) => onInputChange(e, "ManufacturerId")}
            optionLabel="ManufacturerName"
            options={manufacturers}
            autoFocus
            className={classNames({
              "p-invalid": submitted && !selectedCar.ManufacturerId,
            })}
            placeholder="Chọn nhà sản xuất"
          />
          {(submitted && !selectedCar.ManufacturerId) && (
            <small className="p-error">Hãng xe không được để trống.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="txtCarTypeId">
            Dòng xe <b className="p-error">*</b>
          </label>
          <Dropdown
            id="txtCarTypeId"
            value={selectedCar.CarTypeId}
            optionValue="TypeId"
            onChange={(e) => onInputChange(e, "CarTypeId")}
            optionLabel="TypeName"
            options={carTypes}
            className={classNames({
              "p-invalid": submitted && !selectedCar.CarTypeId,
            })}
            placeholder="Chọn dòng xe"
          />
          {(submitted && !selectedCar.CarTypeId) && (
            <small className="p-error">Dòng xe không được để trống.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="txtLicensePlate">
            Biển số xe <b className="p-error">*</b>
          </label>
          <InputText
            id="txtLicensePlate"
            value={selectedCar.LicensePlate}
            onChange={(e) => onInputChange(e, "LicensePlate")}
            required
            className={classNames({
              "p-invalid": submitted && !selectedCar.LicensePlate,
            })}
          />
          {(submitted && !selectedCar.LicensePlate) && (
            <small className="p-error">Biển số xe không được để trống.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtYearOfManufacture">
            Năm sản xuất <b className="p-error">*</b>
          </label>
          <InputText
            id="txtYearOfManufacture"
            value={selectedCar.YearOfManufacture}
            onChange={(e) => onInputChange(e, "YearOfManufacture")}
            required
            className={classNames({
              "p-invalid": submitted && !selectedCar.YearOfManufacture,
            })}
          />
          {(submitted && !selectedCar.YearOfManufacture) && (
            <small className="p-error">Năm sản xuất không được để trống.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtVIN">
            VIN <b className="p-error">*</b>
          </label>
          <InputText
            id="txtVIN"
            value={selectedCar.VIN}
            onChange={(e) => onInputChange(e, "VIN")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !selectedCar.VIN,
            })}
          />
          {(submitted && !selectedCar.VIN) && (
            <small className="p-error">VIN không không được để trống.</small>
          )}
        </div>
      </Dialog>
    </Fragment>
  );
};
export default CarTable;
