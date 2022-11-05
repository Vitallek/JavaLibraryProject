import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
//routes
import AdminMainComponent from "./Admin/AdminMainComponent";

const ProtectedRoutes = () => (
  <Routes>
    <Route path="/moderation" element={<AdminMainComponent />} />
  </Routes>
)

export default ProtectedRoutes;
