import { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { getMaintainanceCycle } from "../../services/maintainance-cycle-service";
import axios from "axios";

const MaintainanceCycleAutoComplete = (props) => {
  const [searchText, setSearchText] = useState(null);
  const [filteredValues, setFilteredValues] = useState([]);
  const [selectedMaintainanceCyle, setSelectedMaintainanceCyle] = useState();

  //search maintaianance cycle
  useEffect(() => {
    const source = axios.CancelToken.source();
    getMaintainanceCycle(20, 1, searchText, source.token).then((res) => {
      const data = res?.data.Result.Data;
      setFilteredValues(data);
    });
    return () => {
      source.cancel();
    };
  }, [searchText]);

  const onSearch = (event) => {
    let query = event.query.trim();
    if (query === searchText?.trim()) {
      return setFilteredValues([...filteredValues]);
    }
    setSearchText(query);
  };

  const onSelect = (selectedItem) => {
    if (selectedItem) {
      props.onSelect(selectedItem);
      const {
        CarTypeName,
        ManufacturerName,
        YearOfManufactureFrom,
        YearOfManufactureTo,
      } = selectedItem;
      setSelectedMaintainanceCyle(
        `${CarTypeName} - ${ManufacturerName} - ${YearOfManufactureFrom} - ${YearOfManufactureTo}`
      );
    }
  };

  const itemPlateTemplate = (item) => {
    return (
      <div className="grid">
        <div className="col-6 md:col-3">{item.CarTypeName}</div>
        <div className="col-6 md:col-3 pl-4">{item.ManufacturerName}</div>
        <div className="col-6 md:col-3 pl-4">{item.YearOfManufactureFrom}</div>
        <div className="col-6 md:col-3 pl-4">{item.YearOfManufactureTo}</div>
      </div>
    );
  };

  return (
    <AutoComplete
      id={props.id}
      suggestions={filteredValues}
      value={selectedMaintainanceCyle}
      completeMethod={onSearch}
      field="CarTypeName"
      dropdown
      forceSelection
      itemTemplate={itemPlateTemplate}
      onSelect={(e) => onSelect(e.value)}
      placeholder="Nhập từ khoá"
      className="w-full"
    />
  );
};

export default MaintainanceCycleAutoComplete;
