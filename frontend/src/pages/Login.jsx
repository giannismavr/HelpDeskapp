import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// loginApi κάνει HTTP request με fetch στο backend.
import { login as loginApi } from "../services/api";

// useAuth (React Context) για global state (token/user) σε όλη την εφαρμογή
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const nav = useNavigate();

  // Παίρνουμε το login() function από AuthContext για να αποθηκεύσουμε token/user.
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");

  async function onSubmit(e) {
    // preventDefault για να μη γίνει page reload στο submit.
    e.preventDefault();

    // Καθαρίζουμε προηγούμενο error.
    setErr("");

    try {
      // Κλήση στο backend (/api/auth/login) μέσω fetch wrapper.
      // Fetch API
      const data = await loginApi({ email, password });

      // Αποθήκευση token/user (συνήθως σε state + localStorage).
      login(data);

      // Redirect στο /tickets μετά από επιτυχημένο login.
      nav("/tickets");
    } catch (e2) {
      // Αν το backend επιστρέψει error, το δείχνουμε στον χρήστη.
      setErr(e2.message);
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 480 }}>
      <h2>Login</h2>

      {/* Αν υπάρχει err, δείξε alert */}
      {err && <div className="alert alert-danger">{err}</div>}

      {/* Form submit handler */}
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <label className="form-label">Email</label>

          {/* Controlled input (value + onChange) */}
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>

          {/* Controlled input για password */}
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100">Login</button>
      </form>

      <div className="mt-3">
        Δεν έχεις λογαριασμό; <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
