import { Fragment, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

const AppDataTable = (props) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const deleteSelectedItem = () => {
    props.deleteSelectedItem(selectedItem);
    hideDeleteItemDialog();
    setSelectedItem(null);
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };

  const showDeleteItemDialog = (rowData) => {
    setDeleteItemDialog(true);
    setSelectedItem(rowData);
  };

  const header = (
    <div className="table-header flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm..."
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
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => showDeleteItemDialog(rowData)}
        />
      </Fragment>
    );
  };

  const deleteItemDialogFooter = (
    <Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedItem}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <div className="card">
        <DataTable
          value={props.data}
          dataKey={props.dataKey}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} items"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
          expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={props.rowExpansionTemplate}
        >
          {props.rowExpansionTemplate && (
            <Column expander={true} style={{ width: "3em" }} />
          )}
          {/* <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column> */}

          {props.columns.map((item) => (
            <Column
              key={item.field}
              field={item.field}
              header={item.header}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
          ))}

          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={deleteItemDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteItemDialogFooter}
        onHide={hideDeleteItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedItem && <span>Bạn thật sự muốn xoá dữ liệu đã chọn?</span>}
        </div>
      </Dialog>
    </Fragment>
  );
};

export default AppDataTable;
