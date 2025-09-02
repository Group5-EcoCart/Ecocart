import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Layout from "./Components/Utils/Layout";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import EcoPoints from "./Pages/EcoPoints";
import Orders from "./Pages/Orders";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import UserDashboard from "./Pages/UserDashboard";
import ProtectedRoute from "./Components/Utils/ProtectedRoute"; // <-- Import ProtectedRoute

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside the Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="ecopoints" element={<EcoPoints />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="userdashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}