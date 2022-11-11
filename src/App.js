import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./App.css";

import RootLayout from "./components/layout/root-layout/RootLayout";
import HomePage from "./pages/home/Home";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import CustomersPage from "./pages/customers/CustomersPage";
import LoginPage from "./pages/login/LoginPage";
import SparePartPage from "./pages/spare-part/SparePartPage";

function App() {
  const toastContent = useSelector((state) => state.ui.toastContent);
  const toast = useRef();

  useEffect(() => {
    if (toastContent?.severity) {
      toast.current.show(toastContent);
    }
  }, [toastContent]);

  return (
    <BrowserRouter>
      {/* <RootLayout> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/app" element={<RootLayout />}>
          <Route index path="home" element={<HomePage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customer-detail">
            <Route path="new" element={<CustomerDetailPage />} />
            <Route path=":id" element={<CustomerDetailPage />} />
          </Route>
          <Route path="spare-part" element={<SparePartPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* </RootLayout> */}
      <Toast ref={toast} position="top-right" />
    </BrowserRouter>
  );
}

export default App;
