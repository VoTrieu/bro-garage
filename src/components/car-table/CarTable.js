import { Fragment, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { trim } from "lodash";

const CarTable = (props) => {
  let emptyCar = {
    CarTypeId: "",
    ManufaturerId: "",
    LicensePlate: "",
    YearOfManufacture: "",
    VIN: "",
  };

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(emptyCar);
  const [isShowDeleteCarDialog, setIsShowDeleteCarDialog] = useState(false);
  const [isShowCarDetailDialog, setIsShowCarDetailDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hideDeleteCarDialog = () => {
    setIsShowDeleteCarDialog(false);
  };

  const hideCarDetailDialog = () => {
    setIsShowCarDetailDialog(false);
  };

  const deleteCar = () => {};

  const saveCar = () => {
    setSubmitted(true);
    for (const key in selectedCar) {
      if (!trim(selectedCar[key])) {
        return;
      }
    }
    setCars((currentCars) => [...currentCars, selectedCar]);
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
          onClick={() => ""}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => ""}
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
        <Column field="LicensePlate" header="Biển số xe" sortable></Column>
        <Column field="CarTypeId" header="Dòng xe" sortable></Column>
        <Column field="ManufaturerId" header="Hãng xe" sortable></Column>
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
      >
        <div className="field">
          <label htmlFor="txtCarTypeId">Dòng xe</label>
          <InputText
            id="txtCarTypeId"
            value={selectedCar.CarTypeId}
            onChange={(e) => onInputChange(e, "CarTypeId")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !selectedCar.CarTypeId,
            })}
          />
          {submitted && !selectedCar.CarTypeId && (
            <small className="p-error">Dòng xe không hợp lệ.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtManufaturerId">Hãng xe</label>
          <InputText
            id="txtManufaturerId"
            value={selectedCar.ManufaturerId}
            onChange={(e) => onInputChange(e, "ManufaturerId")}
            required
            className={classNames({
              "p-invalid": submitted && !selectedCar.ManufaturerId,
            })}
          />
          {submitted && !selectedCar.ManufaturerId && (
            <small className="p-error">Hãng xe không hợp lệ.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtLicensePlate">Biển số xe</label>
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
            <small className="p-error">Biển số xe không hợp lệ.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtYearOfManufacture">Năm sản xuất</label>
          <InputText
            id="txtYearOfManufacture"
            value={selectedCar.YearOfManufacture}
            onChange={(e) => onInputChange(e, "YearOfManufacture")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !selectedCar.YearOfManufacture,
            })}
          />
          {submitted && !selectedCar.YearOfManufacture && (
            <small className="p-error">Năm sản xuất không hợp lệ.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtVIN">VIN</label>
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
            <small className="p-error">VIN không hợp lệ.</small>
          )}
        </div>
      </Dialog>
    </Fragment>
  );
};
export default CarTable;
