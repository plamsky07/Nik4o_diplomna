import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";

import Home from "../pages/Home.jsx";
import Catalog from "../pages/Catalog.jsx";
import Contact from "../pages/Contact.jsx";
import Profile from "../pages/Profile.jsx";
import CarDetails from "../pages/CarDetails.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import InquiriesAdmin from "../pages/Admin/Inquiries.jsx";
import CarsAdmin from "../pages/Admin/Cars.jsx";
import RequireAdmin from "./RequireAdmin.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/katalog" element={<Catalog />} />
        <Route path="/kontakti" element={<Contact />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/kola/:id" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vhod" element={<Login />} />
        <Route path="/registracia" element={<Register />} />
        <Route path="/zabravena-parola" element={<ForgotPassword />} />
<Route
  path="/admin"
  element={
    <RequireAdmin>
      <CarsAdmin />
    </RequireAdmin>
  }
/>

<Route
  path="/admin/avtomobili"
  element={
    <RequireAdmin>
      <CarsAdmin />
    </RequireAdmin>
  }
/>

<Route
  path="/admin/zapitvania"
  element={
    <RequireAdmin>
      <InquiriesAdmin />
    </RequireAdmin>
  }
/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
