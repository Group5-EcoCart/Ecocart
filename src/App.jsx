import { Routes, Route } from 'react-router-dom';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Home from './Pages/Home';
import Wishlist from './Pages/Wishlist';
import Cart from './Pages/Cart';
import Shop from './Pages/Shop'; // Import the new Shop page
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import ProductDetail from './Pages/ProductDetail';
import Profile from './Pages/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* App Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} /> {/* Add the shop route */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Placeholder Dashboard Routes */}
        <Route path="/seller/dashboard" element={<div><h1>Welcome Seller!</h1></div>} />
        <Route path="/admin/dashboard" element={<div><h1>Welcome Admin!</h1></div>} />
      </Routes>
    </>
  );
}

export default App;