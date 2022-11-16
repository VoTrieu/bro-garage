import { Fragment, useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";

const AppDataTable = (props) => {
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { TotalPage, PageIndex, PageSize, TotalRow } =
    props.paginatorOptions || {
      TotalPage: 0,
      PageIndex: 1,
      PageSize: 10,
    };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Nhấn phím 'Enter' để đi tới trang này."
  );

  const [first, setFirst] = useState();
  const [rows, setRows] = useState(PageSize);
  const paginatorRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  //update page size
  useEffect(() => {
    const _first = (PageIndex - 1) * PageSize;
    setFirst(_first);
  }, [PageIndex, PageSize]);

  //search data from backend
  useEffect(() => {
    if (isFirstRender) {
      //prevent from getting data twice at beginning
      return setIsFirstRender(false);
    }

    let timer = setTimeout(() => {
      fetchData(rows, 1, searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const fetchData = (pageSize, pageIndex, searchText) => {
    props.fnGetData(pageSize, pageIndex, searchText);
  };

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

  const createNewItem = () => {
    props.createNewItem();
  };

  const updateItem = (rowData) => {
    props.updateItem(rowData);
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(props.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, props.excelFileName);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const header = (
    <div className="table-header flex justify-content-between align-items-center">
      <div>
        <h3>{props.title}</h3>
      </div>
      <div className="flex align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setSearchText(e.target.value)}
            placeholder="Tìm kiếm..."
          />
        </span>
        <span className="p-input-icon-left ml-4">
          <i className="pi pi-search" />
          <Button
            label="Thêm mới"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={createNewItem}
          />
        </span>
        {props.excelExportable && (
          <span className="p-input-icon-left ml-4">
            <i className="pi pi-search" />
            <Button
              label="Xuất Excel File"
              icon="pi pi-file-excel"
              className="p-button-success"
              onClick={exportExcel}
            />
          </span>
        )}
      </div>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            updateItem(rowData);
          }}
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

  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;
        setFirst(first);
        setPageInputTooltip("Nhấn phím 'Enter' để đi tới trang này.");
        fetchData(rows, page - 1);
      }
    }
  };

  const onPageInputChange = (event) => {
    const inputedPage = event.target.value;
    setCurrentPage(inputedPage);
  };

  const onPaginatorChange = (options) => {
    setRows(options.rows);
    fetchData(options.rows, options.page + 1, searchText);
  };

  const paginatorTemplate = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Previous</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Next</span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { "p-disabled": true });

        return (
          <span className={className} style={{ userSelect: "none" }}>
            ...
          </span>
        );
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    CurrentPageReport: (options) => {
      return (
        <Fragment>
          <span
            className="mx-3"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Go to
            <InputText
              size="3"
              className="ml-1"
              value={currentPage}
              tooltip={pageInputTooltip}
              onKeyDown={(e) => onPageInputKeyDown(e, options)}
              onChange={onPageInputChange}
            />
          </span>
          <span style={{ color: "var(--text-color)" }}>of {TotalPage}</span>
        </Fragment>
      );
    },
  };

  return (
    <Fragment>
      <div className="card">
        <DataTable
          value={props.data}
          dataKey={props.dataKey}
          header={header}
          stripedRows
          responsiveLayout="scroll"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
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
        <Paginator
          ref={paginatorRef}
          template={paginatorTemplate}
          first={first}
          rows={rows}
          totalRecords={TotalRow}
          onPageChange={onPaginatorChange}
        ></Paginator>
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
