import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import VouchersPage from "./pages/VouchersPage";
import ClientsPage from "./pages/ClientsPage";
import PaymentsPage from "./pages/PaymentsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connect" element={<LandingPage />} />

        <Route path="/" element={<DashboardPage />} />
        <Route path="/vouchers" element={<VouchersPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />

      </Routes>
    </BrowserRouter>
  );
}
