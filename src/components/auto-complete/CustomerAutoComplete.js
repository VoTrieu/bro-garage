import { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { getCustomers } from "../../services/customer-service";
import axios from "axios";

const CustomerAutoComplete = (props) => {
  const [searchText, setSearchText] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

    //search car
  useEffect(() => {
    const source = axios.CancelToken.source();
    getCustomers(20, 1, searchText, source.token).then((res) => {
      const data = res?.data.Result.Data;
      setFilteredCustomers(data);
    });
    return () => {
      source.cancel();
    };
  }, [searchText]);

  const onSearchCustomer = (event) => {
    let query = event.query.trim();
    if (query === searchText?.trim()) {
      return setFilteredCustomers([...filteredCustomers]);
    }
    setSearchText(query);
  };

  const onCustomerChange = (customer) => {
    if (customer) {
      props.setValue && props.setValue("CustomerId", customer.CustomerId);
      props.onSelectCustomer && props.onSelectCustomer(customer);
    }
  };

  const itemCustomerTemplate = (item) => {
    return (
      <div className="grid">
        <div className="col-6 md:col-4">{item.FullName}</div>
        <div className="col-6 md:col-4 pl-4">{item.PhoneNumber}</div>
        <div className="col-6 md:col-4 pl-4">{item.Email}</div>
      </div>
    );
  };

  return (
    <AutoComplete
      id={props.field?.name}
      {...props.field}
      suggestions={filteredCustomers}
      completeMethod={onSearchCustomer}
      field="FullName"
      dropdown
      forceSelection
      itemTemplate={itemCustomerTemplate}
      onSelect={(e) => onCustomerChange(e.value)}
      placeholder="Nhập từ khoá"
      className={classNames("w-full", {
        "p-invalid": props.fieldState?.error,
      })}
    />
  );
};

export default CustomerAutoComplete;
