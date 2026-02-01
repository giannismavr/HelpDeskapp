import { useEffect, useMemo, useState } from "react";
import { createTicket, getUsers } from "../services/api";
import { useAuth } from "../auth/AuthContext";


const CATEGORIES = ["Hardware", "Software", "Network", "Billing", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CreateTicket() {
  const { user } = useAuth();
  // const role = user?.role || "user";
  const isStaff = user?.role === "admin" || user?.role === "agent";

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "Software",
    priority: "Medium",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
    }));
  }, [user]);


  // Load users only for agent/admin
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      if (!isStaff) return;

      setLoadingUsers(true);
      try {
        const list = await getUsers();

        // προαιρετικό: μην δείχνεις admin/agent στο dropdown, μόνο "user" accounts
        const onlyUsers = list.filter((u) => u.role === "user");

        if (!cancelled) {
          setUsers(onlyUsers);

          // auto-select first user (ή άστο κενό)
          const firstId = onlyUsers[0]?._id || onlyUsers[0]?.id || "";
          setSelectedUserId(firstId);

          // auto-fill name/email από τον πρώτο user
          if (firstId) {
            const u = onlyUsers.find((x) => (x._id || x.id) === firstId);
            setForm((prev) => ({
              ...prev,
              name: u?.name || "",
              email: u?.email || "",
            }));
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [isStaff]);

  useEffect(() => {
    if (user?.role === "user") {
      setForm((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
      }));
    }
  }, [user]);

  // όταν αλλάζει selected user, auto-fill name/email
  useEffect(() => {
    if (!isStaff) return;
    if (!selectedUserId) return;

    const u = users.find((x) => (x._id || x.id) === selectedUserId);
    if (!u) return;

    setForm((prev) => ({
      ...prev,
      name: u?.name || "",
      email: u?.email || "",
    }));
  }, [selectedUserId, users, isStaff]);

  const errors = useMemo(() => {
    const e = {};

    // name/email required αλλά για staff θα είναι auto-filled
    if (!form.name.trim()) e.name = "Το όνομα είναι υποχρεωτικό.";
    if (!form.email.trim()) e.email = "Το email είναι υποχρεωτικό.";
    else if (!isEmailValid(form.email)) e.email = "Μη έγκυρο email.";

    if (!form.subject.trim()) e.subject = "Το θέμα είναι υποχρεωτικό.";
    else if (form.subject.trim().length < 5) e.subject = "Βάλε τουλάχιστον 5 χαρακτήρες.";

    if (!form.description.trim()) e.description = "Η περιγραφή είναι υποχρεωτική.";
    else if (form.description.trim().length < 20) e.description = "Βάλε τουλάχιστον 20 χαρακτήρες.";

    // staff: πρέπει να έχει επιλεγεί user
    if (isStaff && !selectedUserId) e.createdBy = "Επέλεξε χρήστη για λογαριασμό του οποίου θα γίνει το ticket.";

    return e;
  }, [form, isStaff, selectedUserId]);

  const isValid = Object.keys(errors).length === 0;

  function onChange(e) {
    const { name, value } = e.target;

    // staff: μην επιτρέπεις χειροκίνητη αλλαγή name/email (auto)
    if (isStaff && (name === "name" || name === "email")) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValid) {
      setError("Διόρθωσε τα πεδία της φόρμας και ξαναπροσπάθησε.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        category: form.category,
        priority: form.priority,
        description: form.description.trim(),
      };

      // staff: create on behalf of user
      if (isStaff) payload.createdBy = selectedUserId;

      const result = await createTicket(payload);

      setSuccess(`✅ Το ticket δημιουργήθηκε με επιτυχία! (ID: ${result?.ticket?._id || "N/A"})`);

      // reset (κρατάμε selected user για staff)
      setForm((prev) => ({
        ...prev,
        subject: "",
        category: "Software",
        priority: "Medium",
        description: "",
        ...(isStaff ? {} : { name: "", email: "" }),
      }));
    } catch (err) {
      setError(err.message || "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-3">Δημιουργία Νέου Ticket</h2>

      {isStaff ? (
        <p className="text-muted">
          Δημιουργείς ticket <strong>για λογαριασμό χρήστη</strong>. Επίλεξε χρήστη και συμπλήρωσε τα υπόλοιπα πεδία.
        </p>
      ) : (
        <p className="text-muted">
          Συμπλήρωσε τα στοιχεία σου και περιέγραψε το πρόβλημα για να δημιουργηθεί νέο αίτημα υποστήριξης.
        </p>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={onSubmit} className="card p-3">
        <div className="row g-3">
          {/* Staff-only: select user */}
          {isStaff && (
            <div className="col-12">
              <label className="form-label">Create for user</label>
              <select
                className={`form-select ${errors.createdBy ? "is-invalid" : ""}`}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loadingUsers || users.length === 0}
              >
                {users.length === 0 ? (
                  <option value="">No users available</option>
                ) : (
                  users.map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.email} {u.name ? `(${u.name})` : ""}
                    </option>
                  ))
                )}
              </select>
              {errors.createdBy && <div className="invalid-feedback">{errors.createdBy}</div>}
              {loadingUsers && <div className="form-text">Loading users...</div>}
            </div>
          )}

          <div className="col-md-6">
            <label className="form-label">Ονοματεπώνυμο</label>
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="π.χ. Γιάννης Παπαδόπουλος"
              readOnly={!!user}
              // disabled={isStaff} // auto-filled for staff
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="name@example.com"
              readOnly={!!user}
              //disabled={isStaff} // auto-filled for staff
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Θέμα</label>
            <input
              className={`form-control ${errors.subject ? "is-invalid" : ""}`}
              name="subject"
              value={form.subject}
              onChange={onChange}
              placeholder="π.χ. Δεν μπορώ να συνδεθώ στον λογαριασμό μου"
            />
            {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Κατηγορία</label>
            <select className="form-select" name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Προτεραιότητα</label>
            <select className="form-select" name="priority" value={form.priority} onChange={onChange}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Περιγραφή</label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              rows="5"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Περιέγραψε το πρόβλημα με όσο περισσότερες λεπτομέρειες γίνεται..."
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="col-12 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setError("");
                setSuccess("");
                setForm((prev) => ({
                  ...prev,
                  subject: "",
                  category: "Software",
                  priority: "Medium",
                  description: "",
                  ...(isStaff ? {} : { name: prev.name, email: prev.email }),
                }));
                
              }}
              disabled={loading}
            >
              Καθαρισμός
            </button>

            <button type="submit" className="btn btn-primary" disabled={!isValid || loading || (isStaff && loadingUsers)}>
              {loading ? "Αποστολή..." : "Υποβολή Ticket"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
