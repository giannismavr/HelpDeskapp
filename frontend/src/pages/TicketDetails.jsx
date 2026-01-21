import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById } from "../services/api";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const data = await getTicketById(id);
        setTicket(data);
      } catch (e) {
        setError("Δεν βρέθηκε το ticket.");
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  if (loading) return <div className="text-center mt-4">Φόρτωση...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!ticket) return null;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">{ticket.subject}</h2>
        <Link to="/my-tickets" className="btn btn-outline-secondary btn-sm">
          Πίσω
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="mb-2 text-muted small">
            {ticket.email} • {ticket.category} • {ticket.priority} • {ticket.status}
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
    </div>
  );
}
