import { Fragment, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { trim } from "lodash";
import {
  getSparePart,
  deleteSparePart,
  createNewSparePart,
  updateSparePart,
} from "../../services/spare-part-service";

import AppDataTable from "../../components/tables/AppDataTable";

const SparePartPage = () => {
  const [spareParts, setSpareParts] = useState(null);
  const [showSparePartDetailDialog, setShowSparePartDetailDialog] =
    useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [paginatorOptions, setPaginatorOptions] = useState();

  const emptySparePart = {
    ProductCode: "",
    ProductName: "",
    UnitName: "",
    UnitPrice: 0,
    Quantity: 0,
    Remark: "",
  };
  const [selectedSparePart, setSelectSparePart] = useState(emptySparePart);

  useEffect(() => {
    getData();
  }, []);

  const getData = (pageSize, pageIndex, keyword) => {
    getSparePart(pageSize, pageIndex, keyword).then((response) => {
      const { Data, ...paginatorOptions } = response.data.Result;
      setPaginatorOptions(paginatorOptions);
      setSpareParts(Data);
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
    for (const key in selectedSparePart) {
      if (!trim(selectedSparePart[key])) {
        return;
      }
    }
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
        setSpareParts((exsitedSparePart) => [
          ...exsitedSparePart,
          selectedSparePart,
        ]);
        setShowSparePartDetailDialog(false);
      }
    });
  };

  const onInputChange = (e, field) => {
    const val = (e.target && e.target.value) || "";
    let _selectedSparePart = { ...selectedSparePart };
    _selectedSparePart[`${field}`] = val;
    setSelectSparePart(_selectedSparePart);
  };

  const sparePartDialogFooter = (
    <Fragment>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          setShowSparePartDetailDialog(false);
        }}
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveSparePart}
      />
    </Fragment>
  );

  const onPageChange = (options) => {
    const pageIndex = options.page + 1;
    const pageSize = options.rows;
    const keyword = options.keyword;
    getData(pageSize, pageIndex, keyword);
  };

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
        onPageChange={onPageChange}
      />

      <Dialog
        visible={showSparePartDetailDialog}
        style={{ width: "450px" }}
        header="Chi tiết phụ tùng"
        modal
        className="p-fluid"
        footer={sparePartDialogFooter}
        onHide={() => {
          setShowSparePartDetailDialog(false);
        }}
      >
        <div className="field">
          <label htmlFor="txtProductCode">
            Mã phụ tùng <b className="p-error">*</b>
          </label>
          <InputText
            id="txtProductCode"
            value={selectedSparePart.ProductCode}
            onChange={(e) => onInputChange(e, "ProductCode")}
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
            onChange={(e) => onInputChange(e, "ProductName")}
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
            onValueChange={(e) => onInputChange(e, "UnitPrice")}
            required
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.UnitPrice,
            })}
          />
          {submitted && !selectedSparePart.UnitPrice && (
            <small className="p-error">Đơn giá không được để trống.</small>
          )}
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
            onValueChange={(e) => onInputChange(e, "Quantity")}
            className={classNames({
              "p-invalid": submitted && !selectedSparePart.Quantity,
            })}
          />
        </div>

        <div className="field">
          <label htmlFor="txtRemark">Ghi chú</label>
          <InputTextarea
            rows={5}
            cols={30}
            id="txtRemark"
            value={selectedSparePart.Remark}
            onChange={(e) => onInputChange(e, "Remark")}
          />
        </div>
      </Dialog>
    </Fragment>
  );
};

export default SparePartPage;
