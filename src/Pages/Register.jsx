import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../Services/Authservice.js"; 

export default function Register() {
  const [user, setUser] = useState({
    email: "",
    role: "buyer",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (user.password !== user.confirmpassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await authService.register(user);
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
      console.log(err.message);
    }
  };
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="d-flex register-container shadow-lg">
        <div className="register-left d-none d-lg-block">
          <img
            src="Images/Register-bg.png"
            className="register-bg-img"
            alt="Sell more sustainably with our platform"
          />
        </div>
        <div className="register-right p-5 bg-white">
          <h2 className="mb-4 fw-bold">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-bg d-flex align-items-center mb-3">
              <img src="Images/mail.png" width="20px" alt="mail icon" className="mx-3" />
              <input type="email" placeholder="Email Address" className="form-input" name="email" value={user.email} required onChange={handleUpdate} />
            </div>
            <div className="input-bg d-flex align-items-center mb-3">
              <select className="form-input-select" required name="role" value={user.role} onChange={handleUpdate}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div className="input-bg d-flex align-items-center mb-3">
              <img src="Images/password.png" width="20px" alt="lock icon" className="mx-3" />
              <input type="password" placeholder="Password" className="form-input flex-grow-1" required name="password" value={user.password} onChange={handleUpdate} />
              <img src="Images/eye-off.png" width="20px" alt="toggle visibility" className="me-3" style={{ cursor: "pointer" }} />
            </div>
            <div className="input-bg d-flex align-items-center mb-4">
              <img src="Images/password.png" width="20px" alt="lock icon" className="mx-3" />
              <input type="password" placeholder="Confirm Password" className="form-input flex-grow-1" required name="confirmpassword" value={user.confirmpassword} onChange={handleUpdate} />
              <img src="Images/eye-off.png" width="20px" alt="toggle visibility" className="me-3" style={{ cursor: "pointer" }} />
            </div>
            {error && <p className="text-danger text-center small mb-3">{error}</p>}
            <button type="submit" className="btn register-btn w-100 mb-3">Register</button>
          </form>
          <div className="d-flex align-items-center my-3">
            <div className="flex-grow-1" style={{ height: "1px", backgroundColor: "#ddd" }}></div>
            <span className="mx-2 text-muted small">continue with</span>
            <div className="flex-grow-1" style={{ height: "1px", backgroundColor: "#ddd" }}></div>
          </div>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <img src="Images/google.png" alt="Google login" width="32" style={{ cursor: "pointer" }} />
            <img src="Images/facebook.png" alt="Facebook login" width="32" style={{ cursor: "pointer" }} />
          </div>
          <p className="text-center small">
            Already have an account?{" "}
            <Link to="/login" className="register-login-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}