import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { changeMyPassword } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const isLoggedIn = !!token;
  const role = user?.role;
  const label = user?.name?.trim()
    ? user.name
    : (user?.email || "Account");

// const role = user?.role || "";

  const handleLogout = () => {
    if (logout) logout();
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login");
  };

  async function onChangePassword() {
    const oldPassword = prompt("Current password:");
    if (oldPassword === null) return; // cancel

    const newPassword = prompt("New password (min 6 chars):");
    if (newPassword === null) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      await changeMyPassword({ oldPassword, newPassword });
      alert("✅ Password updated!");
    } catch (e) {
      alert(e.message || "Error updating password");
    }
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border rounded-3 px-3 shadow-sm">
      <Link className="navbar-brand fw-bold" to="/">
        HelpDesk
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>

          {/* Logged out */}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </>
          )}

          {/* Logged in: USER */}
          {isLoggedIn && role === "user" && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/create">
                  Create Ticket
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/tickets">
                  My Tickets
                </NavLink>
              </li>
            </>
          )}

          {/* Logged in: AGENT/ADMIN */}
          {isLoggedIn && (role === "agent" || role === "admin") && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/tickets">
                  All Tickets
                </NavLink>
              </li>

              {/* Για admin users page */}
              {role === "admin" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/users">
                    Users
                  </NavLink>
                </li>
              )}
            </>
          )}

          {/* Logout */}
          {isLoggedIn && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {label} <span className="text-muted">({role})</span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li className="dropdown-item-text small">
                  <div className="fw-semibold">{user?.email}</div>
                  <div className="text-muted">Role: {role}</div>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <NavLink className="dropdown-item" to="/account">
                    My Account
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={() => { logout(); }}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}
