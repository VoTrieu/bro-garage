import { Fragment, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { trim, includes } from "lodash";
import {
  getSparePart,
  deleteSparePart,
  createNewSparePart,
  updateSparePart,
  getAllSparePart,
} from "../../services/spare-part-service";

import AppDataTable from "../../components/tables/AppDataTable";

const emptySparePart = {
  ProductCode: "",
  ProductName: "",
  UnitName: "",
  UnitPrice: 0,
  Quantity: 0,
  Remark: "",
};

const SparePartPage = () => {
  const [spareParts, setSpareParts] = useState(null);
  const [showSparePartDetailDialog, setShowSparePartDetailDialog] =
    useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isShowCancelDialog, setIsShowCancelDialog] = useState(false);
  const [paginatorOptions, setPaginatorOptions] = useState();
  const [selectedSparePart, setSelectSparePart] = useState(emptySparePart);

  const getData = (pageSize, pageIndex, keyword) => {
    getSparePart(pageSize, pageIndex, keyword).then((response) => {
      const { Data, ...paginatorOptions } = response.data.Result;
      paginatorOptions.keyword = keyword;
      setPaginatorOptions(paginatorOptions);
      setSpareParts(Data);
    });
  };

  const refreshData = () => {
    getSparePart(
      paginatorOptions.PageSize,
      paginatorOptions.PageIndex,
      paginatorOptions.keyword
    ).then((response) => {
      const data = response.data.Result.Data;
      setSpareParts(data);
    });
  };

  const columns = [
    {
      field: "ProductCode",
      header: "Mã phụ tùng",
    },
    {
      field: "ProductName",
      header: "Mô tả",
    },
    {
      field: "UnitName",
      header: "Đơn vị tính",
    },
    {
      field: "UnitPrice",
      header: "Đơn giá",
    },
    {
      field: "Quantity",
      header: "Số lượng tồn kho",
    },
    {
      field: "Remark",
      header: "Ghi chú",
    },
  ];

  const units = ["Hộp", "Cái", "Lít", "Kg", "Gói", "Bịch"];

  const onDeletedSparePart = (selectedSparePart) => {
    deleteSparePart(selectedSparePart.ProductId).then(() => {
      const updatedSparePartList = spareParts.filter(
        (sparePart) => sparePart.ProductId !== selectedSparePart.ProductId
      );
      setSpareParts(updatedSparePartList);
    });
  };

  const onUpdateSparePart = (rowData) => {
    setSelectSparePart(rowData);
    setSubmitted(false);
    setShowSparePartDetailDialog(true);
  };

  const onCreateNewSparePart = () => {
    setSelectSparePart(emptySparePart);
    setSubmitted(false);
    setShowSparePartDetailDialog(true);
  };

  const saveSparePart = () => {
    setSubmitted(true);
    const optionalFields = ["AvatarUrl", "Remark", "Quantity"];
    for (const key in selectedSparePart) {
      const value = trim(selectedSparePart[key]);
      if ((value === "" || value === "0") && !includes(optionalFields, key)) {
        return;
      }
    }
    setIsFormDirty(false);
    //update existed spare part
    if (selectedSparePart.ProductId) {
      updateSparePart(selectedSparePart).then((response) => {
        const {
          data: { IsSuccess },
        } = response;
        if (IsSuccess) {
          const index = spareParts.findIndex(
            (sparePart) => sparePart.ProductId === selectedSparePart.ProductId
          );
          const _spareParts = [...spareParts];
          _spareParts[index] = selectedSparePart;
          setSpareParts(_spareParts);
          setShowSparePartDetailDialog(false);
        }
      });
      return;
    }

    createNewSparePart(selectedSparePart).then((response) => {
      const {
        data: { IsSuccess },
      } = response;
      if (IsSuccess) {
        refreshData();
        setShowSparePartDetailDialog(false);
      }
    });
  };

  const onInputChange = (e, field, defaultValue) => {
    setIsFormDirty(true);
    const val = (e.target && e.target.value) || defaultValue;
    let _selectedSparePart = { ...selectedSparePart };
    _selectedSparePart[`${field}`] = val;
    setSelectSparePart(_selectedSparePart);
  };

  const onSparePartCancel = () => {
    if (isFormDirty) {
      setIsShowCancelDialog(true);
      return;
    }
    setShowSparePartDetailDialog(false);
  };

  const sparePartDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onSparePartCancel}
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveSparePart}
      />
    </Fragment>
  );

  const cancelConfirmDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          setIsShowCancelDialog(false);
        }}
      />
      <Button
        label="Thoát"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          setIsShowCancelDialog(false);
          setShowSparePartDetailDialog(false);
          setIsFormDirty(false);
        }}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <AppDataTable
        data={spareParts}
        columns={columns}
        dataKey="ProductId"
        title="Phụ Tùng"
        deleteSelectedItem={onDeletedSparePart}
        createNewItem={onCreateNewSparePart}
        updateItem={onUpdateSparePart}
        excelExportable={true}
        excelFileName="Phụ tùng"
        paginatorOptions={paginatorOptions}
        fnGetData={getData}
        fnGetAllDataForExport={getAllSparePart}
      />

      <Dialog
        visible={showSparePartDetailDialog}
        style={{ width: "450px" }}
        header="Chi tiết phụ tùng"
        modal
        className="p-fluid"
        footer={sparePartDialogFooter}
        onHide={onSparePartCancel}
      >
        <div className="field">
          <label htmlFor="txtProductCode">
            Mã phụ tùng <b className="p-error">*</b>
          </label>
          <InputText
            id="txtProductCode"
            value={selectedSparePart.ProductCode}
            onChange={(e) => onInputChange(e, "ProductCode", "")}
            required
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.ProductCode,
            })}
          />
          {submitted && !selectedSparePart.ProductCode && (
            <small className="p-error">Mã phụ tùng không được để trống.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="txtProductName">
            Mô tả <b className="p-error">*</b>
          </label>
          <InputText
            id="txtProductName"
            value={selectedSparePart.ProductName}
            onChange={(e) => onInputChange(e, "ProductName", "")}
            required
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.ProductName,
            })}
          />
          {submitted && !selectedSparePart.ProductName && (
            <small className="p-error">Mô tả không được để trống.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="txtUnitPrice">
            Đơn giá <b className="p-error">*</b>
          </label>
          <InputNumber
            inputId="txtUnitPrice"
            value={selectedSparePart.UnitPrice}
            onValueChange={(e) => onInputChange(e, "UnitPrice", 0)}
            mode="currency"
            min={0}
            currency="VND"
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.UnitPrice,
            })}
          />
        </div>

        <div className="field">
          <label htmlFor="txtUnitName">
            Đơn vị tính <b className="p-error">*</b>
          </label>
          <Dropdown
            id="txtUnitName"
            value={selectedSparePart.UnitName}
            onChange={(e) => onInputChange(e, "UnitName")}
            options={units}
            autoFocus
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.UnitName,
            })}
            placeholder="Chọn đơn vị tính"
          />
          {submitted && !selectedSparePart.UnitName && (
            <small className="p-error">Đơn vị tính không được để trống.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="txtQuantity">Số lượng tồn kho</label>
          <InputNumber
            inputId="txtQuantity"
            value={selectedSparePart.Quantity}
            min={0}
            onValueChange={(e) => onInputChange(e, "Quantity", 0)}
          />
        </div>

        <div className="field">
          <label htmlFor="txtRemark">Ghi chú</label>
          <InputTextarea
            rows={5}
            cols={30}
            id="txtRemark"
            value={selectedSparePart.Remark}
            onChange={(e) => onInputChange(e, "Remark", "")}
          />
        </div>
      </Dialog>

      <Dialog
        visible={isShowCancelDialog}
        style={{ width: "450px" }}
        header="Xác nhận"
        modal
        footer={cancelConfirmDialogFooter}
        onHide={() => {
          setIsShowCancelDialog(false);
        }}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          Dữ liệu đã nhập sẽ bị mất, bạn có thật sự muốn thoát?
        </div>
      </Dialog>
    </Fragment>
  );
};

export default SparePartPage;
