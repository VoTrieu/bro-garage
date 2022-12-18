import { forwardRef, Fragment } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { sumBy } from "lodash";
import classes from "./RepairFormPdf.module.scss";

const RepairFormPdf = forwardRef((props, ref) => {
  const { data } = props;
  const orderDetails = data?.OrderDetails.filter(
    (item) => item.IsHideProduct === false
  );

  const priceBodyTemplate = (rowData, field) => {
    return formatAmount(rowData[field]);
  };

  const titleFooterTemplate = () => {
    return (
      <Fragment>
        <div className="py-2">Cộng (A)</div>
        <div className="py-2">Thuế GTGT (8%) (B)</div>
        <div className="py-2">Tạm ứng (C)</div>
        <div className="py-2">Tổng cộng ((A+B)-C)</div>
      </Fragment>
    );
  };

  const formatAmount = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  const totalFooterTemplate = () => {
    const total = sumBy(orderDetails, (item) => item.Quantity * item.UnitPrice);
    const tax = total * 0.08;
    const finalAmount = total + tax - data.AdvancePayment;
    const totalElement = formatAmount(total);
    const totalIncludedTaxElement = formatAmount(tax);
    const advancePaymentElement = formatAmount(data.AdvancePayment);
    const finalAmountElement = formatAmount(finalAmount);
    return (
      <Fragment>
        <div className="py-2">{totalElement}</div>
        <div className="py-2">{totalIncludedTaxElement}</div>
        <div className="py-2">{advancePaymentElement}</div>
        <div className="py-2">{finalAmountElement}</div>
      </Fragment>
    );
  };

  let footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer={titleFooterTemplate}
          colSpan={4}
          footerStyle={{ textAlign: "right" }}
        />
        <Column
          footer={totalFooterTemplate}
          colSpan={2}
          footerStyle={{ textAlign: "left" }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    data?.OrderId && (
      <div className={classes.pdf_container} ref={ref}>
        <div className="header-info mb-5">
          <h3 className="mb-1">CÔNG TY TNHH DỊCH VỤ Ô TÔ XUÂN LAM</h3>
          <div className="flex my-2 mb-1">
            <b className="w-2">Địa chỉ: </b>
            <span>36 Đường số 2, Phường Tân Thành, Quận Tân Phú, TPHCM</span>
          </div>
          <div className="flex my-2 mb-1">
            <b className="w-2">Hotline: </b>
            <span className="w-3">0937640052</span>
            <b className="w-3">Mã số thuế: </b>
            <span className="w-3">12456789</span>
          </div>
          <div className="flex my-2 mb-1">
            <b className="w-2">Số tài khoản: </b>
            <span className="w-3">087865857657688</span>
            <b className="w-3">Chi nhánh ngân hàng: </b>
            <span className="w-3">Vietcombank</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="mb-2">
            {data.StatusId === 1 ? "PHIẾU BÁO GIÁ" : "QUYẾT TOÁN SỬA CHỮA"}
          </h1>
          <span>Ngày {data.CreatedDate}</span>
        </div>
        <div className="surface-200 text-right mt-2 p-1 flex justify-content-end">
          <span>Số phiếu: </span>
          <div className="w-2">{data.StatusId !== 1 && data.OrderCode}</div>
        </div>
        <section>
          <div className="surface-400 mt-0 p-1">
            <h4 className="my-0">Thông tin khách hàng</h4>
          </div>
          <div className="px-3">
            <div className="flex my-2">
              <span className="w-2">Khách hàng</span>
              <span className="mx-2">:</span>
              <span>{data.Car.Customer.FullName}</span>
            </div>
            <div className="flex my-2">
              <span className="w-2">Người đại diện</span>
              <span className="mx-2">:</span>
              <span>{data.Car.Customer.Representative}</span>
            </div>
            <div className="flex my-2">
              <span className="w-2">Mã số thuế</span>
              <span className="mx-2">:</span>
              <span>{data.Car.Customer.TaxCode}</span>
            </div>
            <div className="flex my-2">
              <span className="w-2">Địa chỉ</span>
              <span className="mx-2">:</span>
              <span>{data.Car.Customer.Address}</span>
            </div>
            <div className="flex my-2">
              <span className="w-2">Điện thoại liên lạc</span>
              <span className="mx-2">:</span>
              <span>{data.Car.Customer.PhoneNumber}</span>
            </div>
            <div className="flex my-2">
              <span className="w-2">Email</span>
              <span className="mx-2">:</span>
              <span>{data.Car.Customer.Email}</span>
            </div>
          </div>
        </section>
        <section className="my-2">
          <div className="surface-400 mt-0 p-1">
            <h4 className="my-0">Thông tin xe</h4>
          </div>
          <div className="grid px-3">
            <div className="col-6">
              <div className="flex my-2">
                <span className="w-2">Biển số</span>
                <span className="mx-2">:</span>
                <span>{data.Car.LicensePlate}</span>
              </div>
              <div className="flex my-2">
                <span className="w-2">Số VIN</span>
                <span className="mx-2">:</span>
                <span>{data.Car.VIN}</span>
              </div>
              <div className="flex my-2">
                <span className="w-2">Số ODO vào</span>
                <span className="mx-2">:</span>
                <span>{data.ODOCurrent}</span>
              </div>
              <div className="flex my-2">
                <span className="w-2">Ngày vào</span>
                <span className="mx-2">:</span>
                <span>{data.DateIn}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="flex my-2">
                <span className="w-2">Loại xe</span>
                <span className="mx-2">:</span>
                <span>{data.Car.TypeName}</span>
              </div>
              <div className="flex my-2">
                <span className="w-2">Kỳ bão dưỡng kế</span>
                <span className="mx-2">:</span>
                <span>{data.ODONext}</span>
              </div>
              <div className="flex my-2">
                <span className="w-2">Ngày giao xe</span>
                <span className="mx-2">:</span>
                <span>{data.DateOutEstimated}</span>
              </div>
            </div>
          </div>
        </section>
        <section className="my-2">
          <div className="surface-400 mt-0 p-1">
            <h4 className="my-0">Yêu cầu của khách hàng / Ghi chú</h4>
          </div>
          <textarea
            className="border w-full px-3 text-base"
            defaultValue={data.CustomerNote}
            rows={5}
          ></textarea>
        </section>

        <section className="my-2">
          <DataTable value={orderDetails} footerColumnGroup={footerGroup}>
            <Column
              field="ProductName"
              header="Nội dung công việc / Tên phụ tùng"
            ></Column>
            <Column field="UnitName" header="Đơn vị tính"></Column>
            <Column field="Quantity" header="Số lượng"></Column>
            <Column
              field="UnitPrice"
              body={(rowData) => priceBodyTemplate(rowData, "UnitPrice")}
              header="Đơn giá"
            ></Column>
            <Column
              field="Total"
              body={(rowData) => priceBodyTemplate(rowData, "Total")}
              header="Thành tiền"
            ></Column>
          </DataTable>
        </section>

        {/* signature */}
        <section className="my-8">
          <div className="grid my-8">
            <div className="col-6 text-center">
              <p>
                <b>XÁC NHẬN GARAGE</b>
              </p>
              <span>(Ký họ tên)</span>
            </div>

            <div className="col-6 text-center">
              <p>
                <b>XÁC NHẬN GARAGE</b>
              </p>
              <span>(Ký họ tên)</span>
            </div>
          </div>
        </section>
        <section className="pt-8">
          <p>
            Phụ tùng thay thế được bảo hành 6 tháng hoặc 10.000 km tùy điều kiện
            nào đến trước.
          </p>
          {data.StatusId === 1 && (
            <p>Báo giá có thời hạn trong 15 ngày kể từ ngày báo giá. </p>
          )}
        </section>
      </div>
    )
  );
});

export default RepairFormPdf;