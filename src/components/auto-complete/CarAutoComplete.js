import { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { getCars } from "../../services/car-service";
import axios from "axios";

const CarAutoComplete = (props) => {
  const [searchText, setSearchText] = useState(null);
  const [filteredCars, setFilteredCars] = useState([]);

    //search car
  useEffect(() => {
    const source = axios.CancelToken.source();
    getCars(20, 1, searchText, source.token).then((res) => {
      const data = res?.data.Result.Data;
      setFilteredCars(data);
    });
    return () => {
      source.cancel();
    };
  }, [searchText]);

  const onSearchCar = (event) => {
    let query = event.query.trim();
    if (query === searchText?.trim()) {
      return setFilteredCars([...filteredCars]);
    }
    setSearchText(query);
  };

  const onLicensePlateChange = (car) => {
    if (car) {
      props.setValue && props.setValue("CarId", car.CarId);
      props.onSelectCar && props.onSelectCar(car);
    }
  };

  const itemLicensePlateTemplate = (item) => {
    return (
      <div className="grid">
        <div className="col-6 md:col-3">{item.LicensePlate}</div>
        <div className="col-6 md:col-3 pl-4">{item.TypeName}</div>
        <div className="col-6 md:col-3 pl-4">{item.ManufacturerName}</div>
        <div className="col-6 md:col-3 pl-4">{item.Customer.FullName}</div>
      </div>
    );
  };

  return (
    <AutoComplete
      id={props.field?.name}
      {...props.field}
      suggestions={filteredCars}
      completeMethod={onSearchCar}
      field="LicensePlate"
      dropdown
      forceSelection
      itemTemplate={itemLicensePlateTemplate}
      onSelect={(e) => onLicensePlateChange(e.value)}
      placeholder="Nhập từ khoá"
      className={classNames("w-full", {
        "p-invalid": props.fieldState?.error,
      })}
    />
  );
};

export default CarAutoComplete;
