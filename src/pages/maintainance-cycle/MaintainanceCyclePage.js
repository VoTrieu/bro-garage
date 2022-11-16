import { Fragment, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import AppDataTable from "../../components/tables/AppDataTable";
import { useNavigate } from "react-router-dom";
import { deleteMaintainanceCycle , getMaintainanceCycle } from "../../services/maintainance-cycle-service";

const MaintainanceCyclePage = () => {
  const navigate = useNavigate();
  const [maintainanceCycles, setMaintainanceCycles] = useState(null);
  const [paginatorOptions, setPaginatorOptions] = useState();

  const getData = (pageSize, pageIndex, keyword) => {
    getMaintainanceCycle(pageSize, pageIndex, keyword).then((response) => {
      const { Data, ...paginatorOptions } = response.data.Result;
      setPaginatorOptions(paginatorOptions);
      setMaintainanceCycles(Data);
    });
  };

  const columns = [
    {
      field: "ManufacturerName",
      header: "Hãng xe",
    },
    {
      field: "CarTypeName",
      header: "Dòng xe",
    },
    {
      field: "YearOfManufactureFrom",
      header: "Năm sản xuất từ",
    },
    {
      field: "YearOfManufactureTo",
      header: "Năm sản xuất đến",
    },
    {
      field: "Note",
      header: "Ghi chú",
    },
  ];

  const deletedSelectedCustomer = (selectedCustomer) => {
    deleteMaintainanceCycle(selectedCustomer.CustomerId).then(() => {
      const updatedCustomerList = maintainanceCycles.filter(
        (customer) => customer.CustomerId !== selectedCustomer.CustomerId
      );
      setMaintainanceCycles(updatedCustomerList);
    });
  };

  const updateCustomer = (selectedCustomer) => {
    navigate(`/app/customer-detail/${selectedCustomer.CustomerId}`);
  };

  const createNewCustomer = () => {
    navigate("/app/customer-detail/new");
  };

  const rowExpansionTemplate = (maintainanceCycle) => {
    return (
      <div className="orders-subtable ml-8">
        <DataTable value={maintainanceCycle.TemplateDetails} responsiveLayout="scroll">
          <Column field="ProductCode" header="Mã phụ tùng"></Column>
          <Column field="ProductName" header="Mô tả"></Column>
          <Column field="Quantity" header="Số lượng"></Column>
          <Column field="UnitName" header="Đơn vị tính"></Column>
          <Column field="UnitPrice" header="Đơn giá"></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <Fragment>
      <AppDataTable
        data={maintainanceCycles}
        columns={columns}
        dataKey="TemplateId"
        title="Chu kỳ bảo dưỡng"
        deleteSelectedItem={deletedSelectedCustomer}
        rowExpansionTemplate={rowExpansionTemplate}
        createNewItem={createNewCustomer}
        updateItem={updateCustomer}
        paginatorOptions={paginatorOptions}
        fnGetData={getData}
      />
    </Fragment>
  );
};

export default MaintainanceCyclePage;

