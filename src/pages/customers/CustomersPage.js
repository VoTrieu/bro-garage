import { Fragment, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import AppDataTable from "../../components/tables/AppDataTable";
import { useNavigate } from "react-router-dom";
import { deleteCustomer, getCustomers } from "../../services/customer-service";

const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(null);
  const [paginatorOptions, setPaginatorOptions] = useState();

  const getData = (pageSize, pageIndex, keyword) => {
    getCustomers(pageSize, pageIndex, keyword).then((response) => {
      const { Data, ...paginatorOptions } = response.data.Result;
      setPaginatorOptions(paginatorOptions);
      setCustomers(Data);
    });
  };

  const columns = [
    {
      field: "FullName",
      header: "Tên khách hàng",
    },
    {
      field: "PhoneNumber",
      header: "Số điện thoại",
    },
    {
      field: "Address",
      header: "Địa chỉ",
    },
    {
      field: "Email",
      header: "Email",
    },
    {
      field: "TaxCode",
      header: "Mã số thuế",
    },
    {
      field: "Note",
      header: "Ghi chú",
    },
  ];

  const deletedSelectedCustomer = (selectedCustomer) => {
    deleteCustomer(selectedCustomer.CustomerId).then(() => {
      const updatedCustomerList = customers.filter(
        (customer) => customer.CustomerId !== selectedCustomer.CustomerId
      );
      setCustomers(updatedCustomerList);
    });
  };

  const updateCustomer = (selectedCustomer) => {
    navigate(`/app/customer-detail/${selectedCustomer.CustomerId}`);
  };

  const createNewCustomer = () => {
    navigate("/app/customer-detail/new");
  };

  const rowExpansionTemplate = (customer) => {
    return (
      <div className="orders-subtable md:ml-8">
        <DataTable
          value={customer.Cars}
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column field="LicensePlate" header="Biển số"></Column>
          <Column field="CarTypeName" header="Dòng xe"></Column>
          <Column field="ManufactureName" header="Nhà sản xuất"></Column>
          <Column field="YearOfManufacture" header="Năm sản xuất"></Column>
          <Column field="VIN" header="VIN"></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <Fragment>
      <AppDataTable
        data={customers}
        columns={columns}
        dataKey="CustomerId"
        title="Khách hàng"
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

export default CustomersPage;
