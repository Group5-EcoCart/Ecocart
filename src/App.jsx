import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Layout from "./Components/Utils/Layout";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import EcoPoints from "./Pages/EcoPoints";
import Orders from "./Pages/Orders";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import UserDashboard from "./Pages/UserDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
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