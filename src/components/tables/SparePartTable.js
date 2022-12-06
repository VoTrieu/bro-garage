import { Fragment, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import axios from "axios";
import { getSparePart } from "../../services/spare-part-service";

const emptySparePart = {
  ProductCode: "",
  ProductName: "",
  Quantity: "",
  UnitName: "",
  UnitPrice: "",
};

const SparePartTable = (props) => {
  const [spareParts, setSpareParts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [isShowDetailDialog, setIsShowDetailDialog] = useState(false);
  const [filteredSparePart, setFilteredSparePart] = useState([]);
  const [updatedsparePart, setUpdatedsparePart] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const { handleSparePartsChange } = props;
  const existedSpareParts = props.existedSpareParts;

  const [selectedSparePart, setSelectedSparePart] = useState(emptySparePart);

  useEffect(() => {
    handleSparePartsChange(spareParts);
  }, [spareParts]);

  useEffect(() => {
    setSpareParts(existedSpareParts);
  }, [existedSpareParts]);

  useEffect(() => {
    if (!selectedSparePart.ProductCode) {
      return;
    }
    const source = axios.CancelToken.source();
    getSparePart(20, 1, searchText, source.token).then((res) => {
      const data = res?.data.Result.Data;
      setFilteredSparePart(data);
    });
    return () => {
      source.cancel();
    };
  }, [searchText, selectedSparePart.ProductCode]);

  const showDeletesparePartsDialog = (sparePart) => {
    setSelectedSparePart({ ...sparePart });
    setIsShowDeleteDialog(true);
  };

  const showDetailsparePartsDialog = (sparePart) => {
    setSelectedSparePart(sparePart);
    setUpdatedsparePart(sparePart);
    setIsShowDetailDialog(true);
  };

  const onDeleteSparePart = () => {
    const newSparePartList = spareParts.filter(
      (sparePart) => sparePart.ProductCode !== selectedSparePart.ProductCode
    );
    setSpareParts(newSparePartList);
    setSelectedSparePart(emptySparePart);
    setIsShowDeleteDialog(false);
  };

  const onSearchSparePart = (event) => {
    let query = event.query.trim();
    if (query === searchText?.trim()) {
      return setFilteredSparePart([...filteredSparePart]);
    }
    setSearchText(query);
  };

  const onCreateNewSparePart = () => {
    setSelectedSparePart(emptySparePart);
    setSubmitted(false);
    setIsShowDetailDialog(true);
  };

  const onSaveSparePart = () => {
    setSubmitted(true);
    if (!selectedSparePart.ProductCode || !selectedSparePart.Quantity) {
      return;
    }

    //update existed spareParts
    const _spareParts = [...spareParts];
    const index = _spareParts.findIndex(
      (sparePart) => sparePart.ProductCode === updatedsparePart?.ProductCode
    );
    if (_spareParts[index]) {
      _spareParts[index] = { ...selectedSparePart };
      setSpareParts(_spareParts);
    } else {
      //add new spareParts
      setSpareParts((currentspareParts) => [
        selectedSparePart,
        ...currentspareParts,
      ]);
    }
    setSelectedSparePart(emptySparePart);
    setIsShowDetailDialog(false);
  };

  const header = (
    <div className="table-header flex justify-content-end">
      <span className="p-input-icon-left">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={onCreateNewSparePart}
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
          onClick={() => showDetailsparePartsDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => showDeletesparePartsDialog(rowData)}
        />
      </Fragment>
    );
  };

  const deleteDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setIsShowDeleteDialog(false)}
      />
      <Button
        label="Xoá"
        icon="pi pi-check"
        className="p-button-text"
        onClick={onDeleteSparePart}
      />
    </Fragment>
  );

  const detailDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setIsShowDetailDialog(false)}
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={onSaveSparePart}
      />
    </Fragment>
  );

  const itemTemplate = (item) => {
    return (
      <div className="grid">
        <div className="col-4">{item.ProductCode}</div>
        <div className="col-8 pl-4">{item.ProductName}</div>
      </div>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(rowData.UnitPrice);
  };

  const totalPriceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(rowData.Quantity * rowData.UnitPrice);
  };

  const onSparePartCodeChange = (searchTextOrSparePart) => {
    if (typeof searchTextOrSparePart === 'object') {
      setSelectedSparePart((oldValue) => {
        return { ...searchTextOrSparePart, Quantity: oldValue.Quantity };
      });
    } else {
      //set value ' ' to trigger search api
      setSearchText(searchTextOrSparePart || " ");
      setSelectedSparePart((oldValue) => {
        return {
          ...emptySparePart,
          ProductCode: searchTextOrSparePart,
          Quantity: oldValue.Quantity,
        };
      });
    }
  };

  const onQuantityChange = (quantity) => {
    setSelectedSparePart((oldValue) => {
      return {
        ...oldValue,
        Quantity: quantity,
      };
    });
  };

  return (
    <Fragment>
      <DataTable
        value={spareParts}
        dataKey="TemplateDetailId"
        header={header}
        responsiveLayout="scroll"
        editMode="row"
      >
        <Column field="ProductCode" header="Mã phụ tùng"></Column>
        <Column field="ProductName" header="Mô tả"></Column>
        <Column field="Quantity" header="Số lượng"></Column>
        <Column field="UnitName" header="Đơn vị tính"></Column>
        <Column
          field="UnitPrice"
          header="Đơn giá"
          body={priceBodyTemplate}
        ></Column>
        <Column header="Tổng" body={totalPriceBodyTemplate}></Column>
        <Column body={actionBodyTemplate} exportable={false}></Column>
      </DataTable>

      <Dialog
        visible={isShowDeleteDialog}
        style={{ width: "450px" }}
        header="Xác nhận"
        modal
        footer={deleteDialogFooter}
        onHide={() => setIsShowDeleteDialog(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedSparePart && (
            <span>
              Bạn muốn xoá phụ tùng <b>{selectedSparePart.ProductCode}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={isShowDetailDialog}
        style={{ width: "450px" }}
        header="Thông tin phụ tùng"
        modal
        className="p-fluid"
        footer={detailDialogFooter}
        onHide={() => setIsShowDetailDialog(false)}
      >
        <div className="field">
          <label htmlFor="aucpProductCode">
            Mã phụ tùng <b className="p-error">*</b>
          </label>
          <AutoComplete
            id="aucpProductCode"
            value={selectedSparePart.ProductCode}
            suggestions={filteredSparePart}
            completeMethod={onSearchSparePart}
            field="ProductCode"
            dropdown
            forceSelection
            itemTemplate={itemTemplate}
            onChange={(e) => onSparePartCodeChange(e.value)}
            placeholder="Nhập từ khoá"
            dropdownarialabel="Select SparePart"
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.ProductCode,
            })}
          />

          {submitted && !selectedSparePart.ProductCode && (
            <small className="p-error">Mã phụ tùng không được để trống.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="txtProductName">Mô tả</label>
          <InputText
            id="txtProductName"
            value={selectedSparePart.ProductName}
            disabled
          />
        </div>

        <div className="field">
          <label htmlFor="txtQuantity">
            Số lượng <b className="p-error">*</b>
          </label>
          <InputNumber
            id="txtQuantity"
            value={selectedSparePart.Quantity}
            onValueChange={(e) => onQuantityChange(e.value)}
            required
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.Quantity,
            })}
          />
          {submitted && !selectedSparePart.Quantity && (
            <small className="p-error">Số lượng không được để trống.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="txtUnitName">Đơn vị tính</label>
          <InputText
            id="txtUnitName"
            value={selectedSparePart.UnitName}
            disabled
          />
        </div>
        <div className="field">
          <label htmlFor="txtUnitPrice">Đơn giá</label>
          <InputText
            id="txtUnitPrice"
            value={selectedSparePart.UnitPrice}
            disabled
          />
        </div>
      </Dialog>
    </Fragment>
  );
};
export default SparePartTable;