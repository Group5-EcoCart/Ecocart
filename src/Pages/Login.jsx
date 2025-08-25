import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../Services/Authservice.js";
import { useAuth } from "../Context/AuthContext.jsx"; 

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.data && response.data.token) {
        login(response.data.user, response.data.token);
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="d-flex register-container shadow-lg">
        <div className="register-left d-none d-lg-block">
          <img
            src="Images/Register-bg.png"
            className="register-bg-img"
            alt="Welcome Back"
          />
        </div>

        <div className="register-right p-5 bg-white">
          <h2 className="mb-2 fw-bold">Welcome Back</h2>
          <p className="text-muted mb-4">Please Login to your account</p>
          <form onSubmit={handleSubmit}>
            <div className="input-bg d-flex align-items-center mb-3">
              <img src="Images/mail.png" width="20px" alt="mail icon" className="mx-3"/>
              <input
                type="email"
                placeholder="Email Address"
                className="form-input"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-bg d-flex align-items-center mb-3">
              <img src="Images/password.png" width="20px" alt="lock icon" className="mx-3"/>
              <input
                type="password"
                placeholder="Password"
                className="form-input flex-grow-1"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <img src="Images/eye-off.png" width="20px" alt="toggle visibility" className="me-3" style={{ cursor: "pointer" }}/>
            </div>
            
            <div className="text-end mb-4">
              <a href="#" className="small register-login-link text-decoration-none">Forgot password?</a>
            </div>

            {error && <p className="text-danger text-center small mb-3">{error}</p>}

            <button type="submit" className="btn register-btn w-100 mb-3">Login</button>
          </form>

          <div className="d-flex align-items-center my-3">
            <div className="flex-grow-1" style={{ height: "1px", backgroundColor: "#ddd" }}></div>
            <span className="mx-2 text-muted small">continue with</span>
            <div className="flex-grow-1" style={{ height: "1px", backgroundColor: "#ddd" }}></div>
          </div>

          <div className="d-flex justify-content-center gap-4 mb-4">
            <img src="Images/google.png" alt="Google login" width="32" style={{ cursor: "pointer" }}/>
            <img src="Images/facebook.png" alt="Facebook login" width="32" style={{ cursor: "pointer" }}/>
          </div>

          <p className="text-center small">
            Do not have an account?{" "}
            <Link to="/register" className="register-login-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}