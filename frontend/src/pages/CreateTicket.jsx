import { useMemo, useState } from "react";
import { createTicket } from "../services/api";

const CATEGORIES = ["Hardware", "Software", "Network", "Billing", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CreateTicket() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "Software",
    priority: "Medium",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const errors = useMemo(() => {
    const e = {};

    if (!form.name.trim()) e.name = "Το όνομα είναι υποχρεωτικό.";
    if (!form.email.trim()) e.email = "Το email είναι υποχρεωτικό.";
    else if (!isEmailValid(form.email)) e.email = "Μη έγκυρο email.";

    if (!form.subject.trim()) e.subject = "Το θέμα είναι υποχρεωτικό.";
    else if (form.subject.trim().length < 5) e.subject = "Βάλε τουλάχιστον 5 χαρακτήρες.";

    if (!form.description.trim()) e.description = "Η περιγραφή είναι υποχρεωτική.";
    else if (form.description.trim().length < 20) e.description = "Βάλε τουλάχιστον 20 χαρακτήρες.";

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function onChange(e) {
    const { name, value } = e.target;
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

      const result = await createTicket(payload);

      setSuccess(`✅ Το ticket δημιουργήθηκε με επιτυχία! (ID: ${result?.ticket?._id || "N/A"})`);

      // reset
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "Software",
        priority: "Medium",
        description: "",
      });
    } catch (err) {
      setError(err.message || "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-3">Δημιουργία Νέου Ticket</h2>
      <p className="text-muted">
        Συμπλήρωσε τα στοιχεία σου και περιέγραψε το πρόβλημα για να δημιουργηθεί νέο αίτημα υποστήριξης.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={onSubmit} className="card p-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Ονοματεπώνυμο</label>
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="π.χ. Γιάννης Παπαδόπουλος"
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
                setForm({
                  name: "",
                  email: "",
                  subject: "",
                  category: "Software",
                  priority: "Medium",
                  description: "",
                });
              }}
              disabled={loading}
            >
              Καθαρισμός
            </button>

            <button type="submit" className="btn btn-primary" disabled={!isValid || loading}>
              {loading ? "Αποστολή..." : "Υποβολή Ticket"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
