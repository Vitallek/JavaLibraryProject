import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
//routes
import AdminMainComponent from "./Admin/AdminMainComponent";

const ProtectedRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminMainComponent />} />
  </Routes>
)

export default ProtectedRoutes;
