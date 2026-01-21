import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border rounded-3 px-3 shadow-sm">
      <Link className="navbar-brand fw-bold" to="/">
        HelpDesk
      </Link>

      {/* Hamburger button (responsive) */}
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
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
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
        </ul>
      </div>
    </nav>
  );
}
