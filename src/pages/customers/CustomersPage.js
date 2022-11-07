import { Fragment, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import AppDataTable from "../../components/tables/AppDataTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(null);
  useEffect(() => {
    axios.get("/customer/get-pagination").then((response) => {
      const data = response.data.Result.Data;
      setCustomers(data);
    });
  }, []);

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
    axios
      .delete("/customer/delete", {
        params: { id: selectedCustomer.CustomerId },
      })
      .then(() => {
        const updatedCustomerList = customers.filter(
          (customer) => customer.CustomerId !== selectedCustomer.CustomerId
        );
        setCustomers(updatedCustomerList);
      });
  };

  const updateCustomer = (selectedCustomer) => {
    navigate(`/customer-detail/${selectedCustomer.CustomerId}`);
  };

  const createNewCustomer = () => {
    navigate("/customer-detail/new");
  };

  const rowExpansionTemplate = (customer) => {
    return (
      <div className="orders-subtable ml-8">
        <DataTable value={customer.Cars} responsiveLayout="scroll">
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
      />
    </Fragment>
  );
};

export default CustomersPage;
