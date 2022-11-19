import { Fragment, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import axios from "axios";
import { trim } from "lodash";

const AppSubDataTable = (props) => {
  let emptyCar = {
    CarTypeId: "",
    ManufaturerId: "",
    LicensePlate: "",
    YearOfManufacture: "",
    VIN: "",
  };
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
    const fetchCarType = async () => {
      const response = await axios.get("car-type/get-all");
      const _carTypes = response.data.Result;
      setCarTypes(_carTypes);
    };

    fetchCarType();
  }, []);

  //get Manufacturers
  useEffect(() => {
    const fetchManufacturers = async () => {
      const response = await axios.get("manufacturer/get-all");
      const _manufacturers = response.data.Result;
      setManufacturers(_manufacturers);
    };

    fetchManufacturers();
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
      _cars[index] = { ...selectedCar };
      setCars(_cars);
    } else {
      //add new car
      const selectedCarType = carTypes.find(
        (car) => car.TypeId === selectedCar.CarTypeId
      );
      selectedCar.CarTypeName = selectedCarType.TypeName;

      const selectedManufacturer = manufacturers.find(
        (manufacturer) =>
          manufacturer.ManufactureId === selectedCar.ManufactureId
      );
      selectedCar.ManufactureName = selectedManufacturer.ManufacturerName;
      setCars((currentCars) => [...currentCars, selectedCar]);
    }
    setSelectedCar(emptyCar);
    setIsShowCarDetailDialog(false);
  };

  const onInputChange = (e, field) => {
    const val = (e.target && e.target.value) || "";
    let _selectedCar = { ...selectedCar };
    _selectedCar[`${field}`] = val;
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
        responsiveLayout="scroll"
      >
        {props.columns.map(column => <Column key={column.field} field={column.field} header={column.header} sortable></Column>)}
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
          <label htmlFor="txtManufaturerId">
            Hãng xe <b className="p-error">*</b>
          </label>
          <Dropdown
            id="txtManufaturerId"
            value={selectedCar.ManufaturerId}
            optionValue="ManufacturerId"
            onChange={(e) => onInputChange(e, "ManufaturerId")}
            optionLabel="ManufacturerName"
            options={manufacturers}
            className={classNames({
              "p-invalid": submitted && !selectedCar.CarTypeId,
            })}
            placeholder="Chọn nhà sản xuất"
          />
          {submitted && !selectedCar.ManufaturerId && (
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
            autoFocus
            className={classNames({
              "p-invalid": submitted && !selectedCar.CarTypeId,
            })}
            placeholder="Chọn dòng xe"
          />
          {submitted && !selectedCar.CarTypeId && (
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
          {submitted && !selectedCar.LicensePlate && (
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
          {submitted && !selectedCar.YearOfManufacture && (
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
          {submitted && !selectedCar.VIN && (
            <small className="p-error">VIN không không được để trống.</small>
          )}
        </div>
      </Dialog>
    </Fragment>
  );
};
export default AppSubDataTable;
