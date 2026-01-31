// import { Link, NavLink } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white border rounded-3 px-3 shadow-sm">
//       <Link className="navbar-brand fw-bold" to="/">
//         HelpDesk
//       </Link>

//       {/* Hamburger button (responsive) */}
//       <button
//         className="navbar-toggler"
//         type="button"
//         data-bs-toggle="collapse"
//         data-bs-target="#navbarNav"
//         aria-controls="navbarNav"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>

//       <div className="collapse navbar-collapse" id="navbarNav">
//         <ul className="navbar-nav ms-auto">
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/">
//               Home
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/create">
//               Create Ticket
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/tickets">
//               My Tickets
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }


import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const isLoggedIn = !!token;
  const role = user?.role;

  const handleLogout = () => {
    if (logout) logout();
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login");
  };

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
            <li className="nav-item ms-lg-2">
              <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
