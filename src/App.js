import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./App.css";

import RootLayout from "./components/layout/root-layout/RootLayout";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import CustomersPage from "./pages/customers/CustomersPage";
import LoginPage from "./pages/login/LoginPage";
import SparePartPage from "./pages/spare-part/SparePartPage";
import MaintainanceCyclePage from "./pages/maintainance-cycle/MaintainanceCyclePage";
import MaintainanceCycleDetailPage from "./pages/maintainance-cycle/MaintainanceCycleDetailPage";
import RepairFormPage from "./pages/repair-form/RepairFormPage";
import RepairFormDetailPage from "./pages/repair-form/RepairFormDetailPage";
import ReportPage from "./pages/report/ReportPage";

function App() {
  const toastContent = useSelector((state) => state.ui.toastContent);
  const { isTokenValid } = useSelector((state) => state.ui);
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
        <Route
          path="/"
          element={
            isTokenValid ? <Navigate to="/app" replace /> : <LoginPage />
          }
        />
        <Route path="/app" element={<RootLayout />}>
          <Route index path="home" element={<ReportPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customer-detail">
            <Route path="new" element={<CustomerDetailPage />} />
            <Route path=":id" element={<CustomerDetailPage />} />
          </Route>
          <Route path="spare-part" element={<SparePartPage />} />

          <Route
            path="maintainance-cycles"
            element={<MaintainanceCyclePage />}
          />

          <Route path="maintainance-cycle-detail">
            <Route path="new" element={<MaintainanceCycleDetailPage />} />
            <Route path=":id" element={<MaintainanceCycleDetailPage />} />
          </Route>

          <Route path="repair" element={<RepairFormPage />} />

          <Route path="repair-detail">
            <Route path="new" element={<RepairFormDetailPage />} />
            <Route path=":id" element={<RepairFormDetailPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* </RootLayout> */}
      <Toast ref={toast} position="top-right" />
    </BrowserRouter>
  );
}

export default App;
