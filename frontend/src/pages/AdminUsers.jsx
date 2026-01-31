import { useEffect, useState } from "react";
import { getUsers, createUser, updateUserRole, deleteUser } from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // form create user
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const list = await getUsers();
      setUsers(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createUser({ email, password, role, name });
      setEmail("");
      setPassword("");
      setName("");
      setRole("user");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onChangeRole(userId, newRole) {
    setError("");
    try {
      await updateUserRole(userId, newRole);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onDelete(userId) {
    if (!confirm("Delete this user?")) return;
    setError("");
    try {
      await deleteUser(userId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <h3 className="mb-3">User Management (Admin)</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Create user form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create User</h5>

          <form className="row g-2" onSubmit={onCreate}>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">user</option>
                <option value="agent">agent</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="col-md-2 d-grid">
              <button className="btn btn-primary" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Users table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Users</h5>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id || u.id}>
                      <td>{u.email}</td>
                      <td>{u.name || "-"}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={u.role}
                          onChange={(e) => onChangeRole(u._id || u.id, e.target.value)}
                        >
                          <option value="user">user</option>
                          <option value="agent">agent</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(u._id || u.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && <div className="text-muted">No users found.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
