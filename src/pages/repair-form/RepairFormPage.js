import { Fragment, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { classNames } from "primereact/utils";
import AppDataTable from "../../components/tables/AppDataTable";
import {
  getRepairForms,
  deleteRepairForm,
} from "../../services/repair-service";
import RepairFormPdf from "../repair-form/RepairFormPdf";
import { getRepairFormDetail } from "../../services/repair-service";
import classes from "./RepairForm.module.scss";

const RepairingFormPage = () => {
  const [repairForms, setRepairForms] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [paginatorOptions, setPaginatorOptions] = useState();
  const navigate = useNavigate();
  const printComponentRef = useRef();
  const [printData, setPrintData] = useState(null);

  const getData = (pageSize, pageIndex, keyword) => {
    getRepairForms(pageSize, pageIndex, keyword).then((response) => {
      const { Data, ...paginatorOptions } = response.data.Result;
      setPaginatorOptions(paginatorOptions);
      setRepairForms(Data);
    });
  };

  const createRepairForm = () => {
    navigate("/app/repair-detail/new");
  };

  const deletedSelectedRepairForm = (repairForm) => {
    deleteRepairForm(repairForm.OrderId).then(() => {
      const updatedList = repairForms.filter(
        (item) => item.OrderId !== repairForm.OrderId
      );
      setRepairForms(updatedList);
    });
  };

  const updateRepairForm = (repairForm) => {
    navigate(`/app/repair-detail/${repairForm.OrderId}`);
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

  const showPrintModal = async (orderId) => {
    setSelectedOrderId(orderId);
    const res = await getRepairFormDetail(orderId);
    const data = res.data.Result;
    setPrintData(data);
    //wait for printData updated
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: selectedOrderId,
  });

  const columns = [
    {
      field: "OrderId",
      header: "Số phiếu",
    },
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

  const rowExpansionTemplate = (order) => {
    return (
      <div className="orders-subtable ml-8">
        <DataTable value={order.OrderDetails} responsiveLayout="scroll">
          <Column field="ProductCode" header="Mã phụ tùng"></Column>
          <Column field="ProductName" header="Mô tả"></Column>
          <Column field="Quantity" header="Số lượng"></Column>
          <Column field="UnitName" header="Đơn vị tính"></Column>
          <Column
            field="UnitPrice"
            header="Đơn giá"
            body={(rowData) => {
              return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(rowData.UnitPrice);
            }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <Fragment>
      <AppDataTable
        data={repairForms}
        columns={columns}
        dataKey="OrderId"
        title="Phiếu bảo dưỡng / sửa chữa"
        deleteSelectedItem={deletedSelectedRepairForm}
        rowExpansionTemplate={rowExpansionTemplate}
        createNewItem={createRepairForm}
        updateItem={updateRepairForm}
        paginatorOptions={paginatorOptions}
        showPrintModal={showPrintModal}
        fnGetData={getData}
        isPrintAble={true}
      />
      <div style={{ display: "none" }}>
        <RepairFormPdf ref={printComponentRef} data={printData} />
      </div>
    </Fragment>
  );
};

export default RepairingFormPage;
