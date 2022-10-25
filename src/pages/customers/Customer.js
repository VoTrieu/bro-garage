import { Fragment, useState } from "react";
import AppPanel from "../../components/app-panel/AppPanel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import Footer from "../../components/layout/footer/Footer";
const CustomerPage = () => {
  const saveCustomer = () => {
    alert("save");
  };

  const functionButtons = [
    {
      label: "Lưu",
      icon: "pi pi-check",
      className: "p-button-success",
      action: saveCustomer,
    },
  ];

  const customerTypes = [
    {
      label: "Cá nhân",
      value: 0,
    },
    {
      label: "Doanh nghiệp",
      value: 1,
    },
  ];
  // const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
  const [formValue, setFormValue] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormValue((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <AppPanel header="Khách Hàng" className="pb-2" toggleable>
        <div className="formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="fullName">Tên Khách Hàng</label>
            <InputText
              id="fullName"
              className="block w-full"
              name="FullName"
              value={formValue.FullName}
              onChange={handleChange}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="customerType">Loại Khách Hàng</label>
            <Dropdown
              id="customerType"
              optionLabel="label"
              value={formValue.customerType}
              options={customerTypes}
              className="w-full"
              name="TypeId"
              onChange={handleChange}
              placeholder="Chọn Loại Khách Hàng"
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="txtPhoneNumber">Số điện thoại</label>
            <InputText
              id="txtPhoneNumber"
              className="block w-full"
              name="PhoneNumber"
              value={formValue.PhoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="txtRepresentative">Người đại diện</label>
            <InputText
              id="txtRepresentative"
              className="block w-full"
              name="Representative"
              value={formValue.Representative}
              onChange={handleChange}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="txtTaxCode">Mã Số Thuế</label>
            <InputText
              id="txtTaxCode"
              className="block w-full"
              name="TaxCode"
              value={formValue.TaxCode}
              onChange={handleChange}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="txtEmail">Email</label>
            <InputText
              id="txtEmail"
              className="block w-full"
              name="Email"
              keyfilter="email"
              value={formValue.Email}
              onChange={handleChange}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="txtAddress">Địa Chỉ</label>
            <InputTextarea
              rows={5}
              cols={30}
              id="txtAddress"
              className="block w-full"
              name="Address"
              value={formValue.Address}
              onChange={handleChange}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="txtRemark">Ghi Chú</label>
            <InputTextarea
              rows={5}
              cols={30}
              id="txtRemark"
              className="block w-full"
              name="Remark"
              value={formValue.Remark}
              onChange={handleChange}
            />
          </div>
        </div>
      </AppPanel>
      <Footer items={functionButtons} />
    </Fragment>
  );
};

export default CustomerPage;
