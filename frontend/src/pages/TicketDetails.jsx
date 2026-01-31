
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getTicketById,
  addTicketComment,
  updateTicketStatus,
  updateTicketPriority,
} from "../services/api";
import { useAuth } from "../auth/AuthContext";

const STATUSES = ["Pending", "In Progress", "Resolved"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const isStaff = user?.role === "admin" || user?.role === "agent";

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // comment box
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getTicketById(id);
      setTicket(data);
    } catch (e) {
      setError(e.message || "Δεν βρέθηκε το ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function onAddComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    setBusy(true);
    setError("");
    try {
      await addTicketComment(id, comment.trim());
      setComment("");
      await load();
    } catch (e2) {
      setError(e2.message || "Σφάλμα κατά την προσθήκη σχολίου.");
    } finally {
      setBusy(false);
    }
  }

  async function onChangeStatus(newStatus) {
    setBusy(true);
    setError("");
    try {
      await updateTicketStatus(id, newStatus);
      await load();
    } catch (e2) {
      setError(e2.message || "Σφάλμα αλλαγής κατάστασης.");
    } finally {
      setBusy(false);
    }
  }

  async function onChangePriority(newPriority) {
    setBusy(true);
    setError("");
    try {
      await updateTicketPriority(id, newPriority);
      await load();
    } catch (e2) {
      setError(e2.message || "Σφάλμα αλλαγής προτεραιότητας.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="text-center mt-4">Φόρτωση...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!ticket) return null;

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">{ticket.subject}</h2>
        <Link to="/tickets" className="btn btn-outline-secondary btn-sm">
          Πίσω
        </Link>
      </div>

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center text-muted small">
            <span>{ticket.email}</span>
            <span>•</span>
            <span>{ticket.category}</span>
            <span>•</span>

            {/* Priority */}
            {isStaff ? (
              <>
                <span className="fw-semibold">Priority:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 160 }}
                  value={ticket.priority}
                  onChange={(e) => onChangePriority(e.target.value)}
                  disabled={busy}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <span>{ticket.priority}</span>
            )}

            <span>•</span>

            {/* Status */}
            {isStaff ? (
              <>
                <span className="fw-semibold">Status:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 170 }}
                  value={ticket.status}
                  onChange={(e) => onChangeStatus(e.target.value)}
                  disabled={busy}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <span>{ticket.status}</span>
            )}
          </div>

          <p className="mb-0">{ticket.description}</p>

          <hr />

          <div className="text-muted small">
            Δημιουργήθηκε: {new Date(ticket.createdAt).toLocaleString()}
            <br />
            Τελευταία ενημέρωση: {new Date(ticket.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <h5 className="mb-3">Σχόλια</h5>

          {(!ticket.comments || ticket.comments.length === 0) && (
            <div className="text-muted">Δεν υπάρχουν σχόλια ακόμα.</div>
          )}

          {ticket.comments?.map((c, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <div className="small text-muted d-flex justify-content-between">
                <span>{c.authorRole}</span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <div>{c.message}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD COMMENT */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Προσθήκη σχολίου</h5>

          <form onSubmit={onAddComment}>
            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Γράψε σχόλιο..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={busy}
            />

            <button className="btn btn-primary" disabled={busy || !comment.trim()}>
              {busy ? "Αποστολή..." : "Αποθήκευση σχολίου"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
