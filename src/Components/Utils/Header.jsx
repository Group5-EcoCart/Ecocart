import { Link } from "react-router-dom";
import Search from "../Search";

export default function Header() {
    return (
        <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-clr">
            <div className="d-flex gap-4">
                <Link to="/home" className="text-clr text-decoration-none">Home</Link>
                <Link to="/shop" className="text-clr text-decoration-none">Shop</Link>
                <Link to="/ecopoints" className="text-clr text-decoration-none">EcoPoints</Link>
                <Link to="/orders" className="text-clr text-decoration-none">Orders</Link>
            </div>

            <div className="d-flex align-items-center gap-3">
                <div className="search-bar d-flex pe-3 align-items-center">
                    <Search />
                </div>
                <Link to="/wishlist"><img src="/Images/Heart.png" alt="heart" width={32} /></Link>
                <Link to="/cart"><img src="/Images/Cart.png" alt="cart" width={32} /></Link>
                <div className="d-flex align-items-center gap-2 text-clr">
                    <Link to="/userdashboard"><img src="/Images/Profile.png" alt="profile" width={36} /></Link>
                    <span>Profile</span>
                </div>
            </div>
        </div>
    );
}